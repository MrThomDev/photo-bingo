import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import { APIContext } from "../../contexts/api.context";
import { CardContext } from "../../contexts/card.context";

import LargeImage from "../../components/modals/largeImage.modal.component";
import DeletePicConfirmation from "../../components/modals/deletePicConfirmation.component";

import TrashIcon from "../../icons/trash.icon";

import styles from "./imageGallery.style.module.css";

const ImageGallery = () => {
  const { index: stringIndex } = useParams();
  const index = Number(stringIndex);
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isModuleOpen, setIsModuleOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [largeImageSrc, setLargeImageSrc] = useState(null);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [imgIndex, setImgIndex] = useState(null);
  const { getPhotosOfArray, deletePhoto, updateCard } = useContext(APIContext);
  const { activeCard } = useContext(CardContext);
  const navigate = useNavigate();

  const loadNextPageOfPhotos = async (page) => {
    try {
      setIsFetching(true);
      const images = await getPhotosOfArray(
        activeCard.cell(index).photos.slice(page * 9 - 9, page * 9)
      );

      if (images.success) {
        setImages((old) => {
          if (page === 1) {
            return images.payload;
          } else {
            return [...old, ...images.payload];
          }
        });
        setIsLoadingImages((old) => false);
      }

      if (images.success === false) {
        throw new Error(images.payload);
      }
    } catch (error) {
      console.error(
        `The server resoponded with a failure message:\n\n${error}\n\n`
      );
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    const photoNames = activeCard.cell(index).photos;
    if (photoNames.length >= page * 9 - 8) {
      loadNextPageOfPhotos(page);
    }
  }, [index, activeCard, page]);

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY + 200 >=
      document.documentElement.scrollHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleImageClick = (imgSrc) => {
    setLargeImageSrc((old) => imgSrc);
    setIsModuleOpen((old) => true);
  };

  const handleCloseModule = () => {
    setIsModuleOpen((old) => false);
  };

  const updateServerBingoData = async () => {
    try {
      const serverResponse = await updateCard(
        activeCard.type,
        activeCard.name,
        activeCard.toArray()
      );

      if (serverResponse.success === false) {
        throw new Error(serverResponse);
      }

      if (serverResponse.success) {
        console.info(
          `The server accepted Card update. Photo deleted from array`
        );
      }
    } catch (error) {
      console.error(error.message.payload);
    }
  };

  const handleDelete = async (targetPhoto) => {
    try {
      const { success, payload: deleteResponse } = await deletePhoto(
        images[targetPhoto].photoName
      );

      if (success === true) {
        const updatePhotoFiles = [...images];
        updatePhotoFiles.splice(targetPhoto, 1);
        setImages(updatePhotoFiles);

        const updatedPhotoNames = [...activeCard.cell(index).photos];
        updatedPhotoNames.splice(targetPhoto, 1);

        activeCard.cell(index).deletePhoto(targetPhoto);
        updateServerBingoData();
        setIsDeleteConfirmOpen(false);
        if (activeCard.cell(index).photos === null) {
          activeCard.reRender();
          navigate(-1);
        }
      }

      if (success === false) {
        throw new Error(deleteResponse);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenDeleteConfirm = (index) => {
    setImgIndex(index);
    setIsDeleteConfirmOpen(true);
  };

  if (isLoadingImages) {
    return (
      <div className={styles[`spinner-container`]}>
        <ClipLoader
          size={120}
          color={"var(--color-accent-primary)"}
          speedMultiplier={0.75}
          cssOverride={{ borderWidth: ".5rem" }}
        />
        <h1 className={styles[`loading-header`]}>Loading...</h1>
      </div>
    );
  }

  return (
    <div>
      <h1 className={styles[`header`]}>{activeCard.cell(index).challenge}</h1>
      <div className={styles[`module-container`]}>
        <LargeImage
          openStatus={isModuleOpen}
          onClose={handleCloseModule}
          imageSrc={largeImageSrc}
        />
        <DeletePicConfirmation
          isDeleteConfirmOpen={isDeleteConfirmOpen}
          setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
          handleDelete={handleDelete}
          imgIndex={imgIndex}
        />
        <div className={styles[`image-grid-container`]}>
          {images.map((photo, index) => {
            if (photo.data === "photo not found") {
              return (
                <div
                  key={`cell-${index}-error`}
                  className={styles[`error-cell`]}
                >
                  <p>
                    Photo: {photo.photoName} <b>could not be found</b>
                  </p>
                </div>
              );
            }
            return (
              <div
                key={`cell-${index}-${photo.name}`}
                className={styles[`photo-cell`]}
              >
                <img
                  key={photo.photoName}
                  onClick={() => {
                    handleImageClick(`data:image/jpeg;base64,${photo.data}`);
                  }}
                  src={`data:image/jpeg;base64,${photo.data}`}
                  alt={`${photo.photoName}`}
                ></img>
                <button
                  className={styles[`trash-btn`]}
                  onClick={() => {
                    handleOpenDeleteConfirm(index);
                  }}
                >
                  <TrashIcon className={styles[`trash-icon`]} />
                </button>
              </div>
            );
          })}
        </div>
        {isLoadingImages && <p>Loading...</p>}
      </div>
      <div className={`${styles[`loader`]}`}>
        {isFetching && <p className={styles[`loading-txt`]}>Loading...</p>}
      </div>
    </div>
  );
};

export default ImageGallery;
