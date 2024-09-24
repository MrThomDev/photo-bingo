import { useState, useEffect } from "react";

import styles from "./largeImage.style.module.css";

const LargeImage = ({ openStatus, onClose, imageSrc }) => {
  const [isOpen, setIsOpen] = useState(openStatus);

  useEffect(() => {
    setIsOpen(openStatus);
  }, [openStatus]);

  return (
    <div
      className={styles[`large-image-container`]}
      style={{ visibility: isOpen ? "visible" : "hidden" }}
    >
      <img src={imageSrc} alt="" onClick={onClose} />
    </div>
  );
};

export default LargeImage;
