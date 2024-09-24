import { useState, useEffect, useContext } from "react";
import styles from "./deleteLists.style.module.css";

import { APIContext } from "../../contexts/api.context";

const DeleteLists = () => {
  const [namesArr, setNamesArr] = useState([]);
  const [expandedName, setExpandedName] = useState(null);
  const { getAllCards, deleteCard } = useContext(APIContext);

  useEffect(() => {
    const fetchCards = async () => {
      const cards = await getAllCards();
      if (cards.success) {
        setNamesArr(cards.payload);
      }
      if (!cards.success) {
        console.error(cards.payload);
      }
    };

    fetchCards();
  }, [getAllCards]);

  const handleListDelete = async (cardName, index) => {
    const deleteResponse = await deleteCard(cardName, index);
    if (deleteResponse.success) {
      const namesArrCopy = [...namesArr];
      namesArrCopy.splice(index, 1);
      setNamesArr(namesArrCopy);
    }

    if (!deleteResponse.success) {
      console.error(deleteResponse.payload);
    }
  };

  const handleClick = (name) => {
    setExpandedName(expandedName === name ? null : name);
  };

  const handleCancel = () => {
    setExpandedName(null);
  };

  const browserName = (name) => {
    return name.replaceAll("_", " ");
  };

  return (
    <div className={styles[`delete-list-container`]}>
      <h1 className={styles[`delete-header`]}>Delete Bingo Card</h1>
      <ul className={styles["name-list"]}>
        {namesArr.map((name, index) => (
          <li
            key={`${index}-${name}`}
            className={`${styles["name-item"]} ${
              expandedName === name ? styles["expanded"] : ""
            }`}
            onClick={() => handleClick(name)}
          >
            <h2 className={styles[`card-name`]}>{browserName(name)}</h2>
            <div
              className={`${styles["expanded-content"]} ${
                expandedName === name ? styles.visable : styles.hidden
              }`}
            >
              <p className={styles["confirmation-txt"]}>
                Deleting "{browserName(name)}"" will permanently remove this
                Card AND all pictures placed inside it. Are you sure you want to
                delete?
              </p>
              <button
                className={`${styles.btn} ${styles["cancel-btn"]}`}
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className={`${styles.btn} ${styles["delete-btn"]}`}
                onClick={() => {
                  handleListDelete(name, index);
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeleteLists;
