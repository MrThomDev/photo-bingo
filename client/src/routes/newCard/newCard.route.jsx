import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { CSSTransition } from "react-transition-group";

import { APIContext } from "../../contexts/api.context";
import { CardContext } from "../../contexts/card.context";

import styles from "./newCard.style.module.css";

const NewCard = () => {
  const [name, setName] = useState("");
  const [nameLength, setNameLength] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const navigate = useNavigate();
  const { makeCard, getCardTree, toastStyle } = useContext(APIContext);
  const { cardTypes, cardTree, setCardTree } = useContext(CardContext);

  useEffect(() => {
    const fetchCardTree = async () => {
      if (Object.keys(cardTree).length === 0) {
        const { success, payload: cardTreeResponse } = await getCardTree();
        if (success) {
          setCardTree(cardTreeResponse);
        } else {
          toast.error(
            `There was a problem fetching card type and name data. Failure message: ${cardTreeResponse}`,
            toastStyle
          );
        }
      }
    };
    fetchCardTree();
  }, []);

  const serverToClientName = () => {
    const serverSafeName = name.trim().replaceAll(" ", "_");

    return serverSafeName;
  };

  const handleChange = (event) => {
    if (event.target.value.length > 30) {
      return;
    }
    const regex = /^[a-zA-Z0-9 ]*$/;

    if (!regex.test(event.target.value)) {
      return;
    }
    setName(event.target.value);
    setNameLength(event.target.value.length);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name.length === 0) {
      console.error("No name entered");
      toast.error(
        "Cards must have a name. Please enter a name. The name may only contain letters, numbers, and spaces.",
        toastStyle
      );
      return;
    }
    const serverName = serverToClientName(name);
    try {
      const { success, payload: cardResponse } = await makeCard(
        selectedType,
        serverName
      );

      if (success) {
        const { success, payload: updatedCardTree } = await getCardTree();
        if (success) {
          setCardTree(updatedCardTree);
        } else {
          toast.error(
            `New card was saved but there was a problem updating the local card type and card name data. Failure message: ${updatedCardTree}`
          );
        }
        navigate(`/display/card/${selectedType}/${serverName}`);
      }
      if (success === false) {
        toast.error(
          `New card was not created. Server responded with a failure message. Error: "${cardResponse}"`,
          toastStyle
        );
        throw new Error(cardResponse);
      }
    } catch (error) {
      console.error(error);
    }
    setName("");
    setNameLength(0);
  };
  return (
    <div className={`${styles[`new-card-container`]}`}>
      <h1 className={styles[`header-text`]}>Create New Card</h1>
      <div className={styles[`card-type-select-container`]}>
        <h2 className={styles[`type-select-text`]}>
          <b>Select</b> the card type you would like to create
        </h2>
        <div className={styles[`card-type-grid`]}>
          {cardTypes.map((type, index) => {
            return (
              <button
                key={`${index}-${type}`}
                className={`${styles[`btn-type`]} ${styles[`btn`]} ${
                  type === selectedType ? styles[`selected`] : ""
                }`}
                onClick={() => {
                  if (selectedType === type) {
                    setSelectedType(null);
                    return;
                  }
                  if (selectedType !== type) {
                    setSelectedType(type);
                    return;
                  }
                }}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>
      <CSSTransition
        in={selectedType}
        timeout={300}
        classNames={{
          enter: styles["submit-enter"],
          enterActive: styles["submit-enter-active"],
          exit: styles["submit-exit"],
          exitActive: styles["submit-exit-active"],
        }}
        unmountOnExit
      >
        <div className={`${styles[`card-submit-container`]}`}>
          <p className={`${styles[`form-text`]}`}>
            New {`${selectedType ? selectedType.toUpperCase() : "😅"}`} Card
            Name
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              id="nameInput"
              placeholder="Enter name"
              value={name}
              onChange={handleChange}
            />
          </form>
          <p className={`${styles[`char-limit`]}`}>{`${nameLength}`} / 30 </p>
          <button className={`${styles[`btn`]}`} onClick={handleSubmit}>
            submit
          </button>
        </div>
      </CSSTransition>
    </div>
  );
};

export default NewCard;
