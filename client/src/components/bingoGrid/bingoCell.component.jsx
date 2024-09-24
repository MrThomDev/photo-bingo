import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { CardContext } from "../../contexts/card.context";

import { SyncLoader } from "react-spinners";

import PhotoIcon from "../../icons/photo.icon";
import CheckCircle from "../../icons/checkCircle.icon";

import PhotoSubmitBtn from "../inputs/photoSubmitBtn.component";

import styles from "./bingoCell.style.module.css";

const BingoCell = ({ index, isGridView }) => {
  const { activeCard, dummyUpdate, setDummyUpdate } = useContext(CardContext);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [photoLinkState, setPhotoLinkState] = useState("none");
  const [isFinished, setIsFinished] = useState(false);

  const photoComponentObj = {
    none: null,
    loading: (
      <button className={`${styles[`btn`]} ${styles[`loading`]}`}>
        <SyncLoader size={5} speedMultiplier={0.75} />
      </button>
    ),
    view: (
      <Link to={`/images/grid/${index}`} className={styles[`gallery-link`]}>
        <button className={styles[`btn`]}>
          <PhotoIcon
            className={`${styles[`photo-icon`]} ${
              isGridView ? styles[`grid-view`] : styles[`list-view`]
            }`}
          />
        </button>
      </Link>
    ),
  };

  useEffect(() => {
    const photos = activeCard.cell(index).photos;

    if (!photos) {
      setPhotoLinkState("none");
      setIsFinished(false);
    }

    if (!photos && isPhotoUploading === true) {
      setPhotoLinkState("loading");
      setIsFinished(false);
    }

    if (photos && isPhotoUploading === false) {
      setPhotoLinkState("view");
      setIsFinished(true);
    }
  }, [dummyUpdate, isPhotoUploading]);

  return (
    <div key={index} className={`${styles[`cell-container`]}`}>
      <div className={styles[`text-container`]}>
        <h2
          className={`${styles["challenge-text"]} ${
            isGridView ? styles["grid-view"] : styles["list-view"]
          }`}
        >
          {activeCard.cell(index).challenge}
        </h2>
        <div
          key={`${index}-isFinished`}
          className={styles[`is-finished-container`]}
        >
          {isFinished ? (
            <CheckCircle
              key={`Finish-${index}`}
              className={styles[`finish-icon`]}
            />
          ) : null}
        </div>
      </div>
      <PhotoSubmitBtn
        key={`photoBtn-${index}`}
        index={index}
        setIsPhotoUploading={setIsPhotoUploading}
        setPhotoLinkState={setPhotoLinkState}
      />
      <div className={styles[`photo-link-container`]}>
        {photoComponentObj[photoLinkState]}
      </div>
    </div>
  );
};

export default BingoCell;
