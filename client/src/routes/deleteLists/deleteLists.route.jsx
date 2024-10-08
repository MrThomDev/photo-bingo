import { useState, useEffect, useContext } from "react";

import { toast } from "react-toastify";

import { APIContext } from "../../contexts/api.context";
import { CardContext } from "../../contexts/card.context";

import styles from "./deleteLists.style.module.css";

const DeleteLists = () => {
  const [expandedName, setExpandedName] = useState(null);
  const { getCardTree, deleteCard, toastStyle } = useContext(APIContext);
  const { cardTree, setCardTree } = useContext(CardContext);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        if (Object.keys(cardTree).length === 0) {
          const cardTreeResponse = await getCardTree();
          console.log(cardTreeResponse);
          if (cardTreeResponse.success) {
            setCardTree(cardTreeResponse.payload);
          } else {
            throw new Error(cardTreeResponse.payload);
          }
        }
      } catch (error) {
        console.error(error.message);
        toast.error(
          `Could not locate card type and card name data. Failure message: ${error.message}`,
          toastStyle
        );
      }
    };

    fetchCards();
  }, []);

  const handleListDelete = async (cardType, cardName) => {
    const deleteResponse = await deleteCard(cardType, cardName);
    const updatedArray = cardTree[cardType].filter((el) => el !== cardName);
    if (deleteResponse.success) {
      setCardTree((old) => ({
        ...old,
        [cardType]: updatedArray,
      }));
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
      <div className={styles[`map-container`]}>
        {Object.keys(cardTree).map((type, index) => {
          const names = cardTree[type];
          return (
            <div className={`delete-section`} key={`${type}-${index}`}>
              <h3 key={type} className={styles[`type-header`]}>
                {type}
              </h3>
              <ul className={styles["name-list"]}>
                {names.map((name, index) => (
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
                        Deleting "{browserName(name)}"" will permanently remove
                        this Card AND all pictures placed inside it. Are you
                        sure you want to delete?
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
                          handleListDelete(type, name, index);
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
        })}
      </div>
      {/* <ul className={styles["name-list"]}>
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
      </ul> */}
    </div>
  );
};

export default DeleteLists;
