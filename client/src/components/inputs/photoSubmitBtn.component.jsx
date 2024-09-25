import { useContext } from "react";

import { APIContext } from "../../contexts/api.context";
import { CardContext } from "../../contexts/card.context";

import { toast, Slide } from "react-toastify";

import styles from "./photoSubmitBtn.style.module.css";

import PlusIcon from "../../icons/plus.icon";

const PhotoSubmitBtn = ({ index, setIsPhotoUploading, setPhotoLinkState }) => {
  const { savePhotos, updateCard } = useContext(APIContext);
  const { activeCard, Card } = useContext(CardContext);

  const photoServerName = () => {
    const serverSafeName = activeCard
      .cell(index)
      .challenge.trim()
      .replaceAll(" ", "_");
    return `${serverSafeName}_${Date.now()}`;
  };

  const handleFileChange = async (event) => {
    setIsPhotoUploading(true);

    const selectedPhotos = event.target.files;
    const formData = new FormData();
    const photos = [];

    for (let i = 0; i < selectedPhotos.length; i++) {
      const fileExtention = "." + selectedPhotos[i].name.split(".").pop();

      const serverName = photoServerName() + `${fileExtention}`;
      photos.push(serverName);

      formData.append("images", selectedPhotos[i], serverName);
    }

    try {
      const saveResponse = await savePhotos(formData);

      if (saveResponse.success === false) {
        setIsPhotoUploading(false);
        setPhotoLinkState("fail");
        toast.error(
          `The server responded with the failuire message: "${saveResponse.payload}\nA refresh will be needed"`,
          {
            position: "bottom-right",
            autoClose: 5000,
            theme: "colored",
            transition: Slide,
            style: {
              backgroundColor: "#bc002d",
              color: "white",
              fontSize: "1.6rem",
            },
            progressStyle: {
              background:
                "linear-gradient(to right, #e68600, #ff9500, #ffa01a)",
            },
          }
        );
        throw new Error(
          `The server responded with the failure message: ${saveResponse.payload}`
        );
      }

      if (saveResponse.success === true) {
        updateServer(photos);
      }
    } catch (error) {
      setIsPhotoUploading(false);
      console.error(error);
    }
  };

  const updateServer = async (photosArr) => {
    const serverCopy = new Card(activeCard.toArray(), activeCard.name);
    serverCopy.cell(index).addPhotos(photosArr);
    try {
      const { success, payload: updateResponse } = await updateCard(
        serverCopy.name,
        serverCopy.toArray()
      );

      if (success === false) {
        throw new Error(
          `The server responded with a failure message: ${updateResponse}`
        );
      }

      if (success) {
        activeCard.cell(index).addPhotos(photosArr);
        setIsPhotoUploading(false);
        console.info(
          `Server accepted Card Update. Cell "${
            activeCard.cell(index).challenge
          }" updated the list of photos`
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const triggerClick = () => {
    document.getElementById(`photo-${index}-upload`).click();
  };

  return (
    <div className={`${styles[`photo-submit-container`]}`}>
      <button
        className={`${styles[`btn`]}`}
        onClick={triggerClick}
        aria-label="Upload photo"
      >
        <PlusIcon className={styles[`plus-icon`]} />
      </button>
      <input
        key={`input-${index}`}
        id={`photo-${index}-upload`}
        className={`${styles[`choose-image-btn`]}`}
        type="file"
        accept="image/*"
        name="image"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default PhotoSubmitBtn;
