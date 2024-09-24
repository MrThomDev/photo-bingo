import styles from "./deletePicConfirmation.style.module.css";

const DeletePicConfirmation = ({
  handleDelete,
  isDeleteConfirmOpen,
  setIsDeleteConfirmOpen,
  imgIndex,
}) => {
  const handleCancel = () => {
    setIsDeleteConfirmOpen(false);
  };

  return (
    <div
      className={`${styles[`delete-confirm-container`]} ${
        styles[isDeleteConfirmOpen ? "visible" : "hidden"]
      }`}
    >
      <p className={`${styles[`confirm-txt`]}`}>
        Photo will be <b>permanently</b> deleted.
      </p>
      <div className={`${styles[`btn-box`]}`}>
        <button
          className={`${styles[`delete-btn`]} ${styles[`btn`]}`}
          onClick={() => {
            handleDelete(imgIndex);
          }}
          aria-label="Confirm delete"
        >
          Delete
        </button>
        <button
          className={`${styles[`cancel-btn`]} ${styles[`btn`]}`}
          onClick={handleCancel}
          aria-label="Cancel Delete"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeletePicConfirmation;
