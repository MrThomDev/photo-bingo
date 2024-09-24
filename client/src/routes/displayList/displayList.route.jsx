import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { APIContext } from "../../contexts/api.context";
import { CardContext } from "../../contexts/card.context";

import { toast, Slide } from "react-toastify";

import { ClipLoader } from "react-spinners";

import BingoGrid from "../../components/bingoGrid/bingoGrid.component";

import styles from "./displayList.style.module.css";

const DisplayList = () => {
  const { listName } = useParams();
  const [isGridView, setIsGridView] = useState(true);
  const [isLoadingCard, setIsLoadingCard] = useState(true);
  const { getCard } = useContext(APIContext);
  const { Card, activeCard, setActiveCard, dummyUpdate } =
    useContext(CardContext);

  const serverToClientName = (name) => {
    const clientSafeName = name.replaceAll("_", " ");
    return clientSafeName;
  };

  const handleChangeView = () => {
    setIsGridView((old) => !old);
  };

  useEffect(() => {
    setIsLoadingCard(true);
    const fetchBingoCardData = async () => {
      const { success, payload: cardData } = await getCard(listName);
      if (success) {
        const selectedCard = new Card(cardData, listName);
        setActiveCard((old) => selectedCard);
        setIsLoadingCard(false);
        return;
      } else {
        console.error(cardData);
        toast.error(
          `Failed to to load Card data. The server responded with: "${cardData}"`,
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
        return;
      }
    };

    fetchBingoCardData();
  }, [listName]);

  useEffect(() => {
    if (!activeCard) {
      setIsLoadingCard(true);
    } else {
      setIsLoadingCard(false);
    }
  }, [activeCard, dummyUpdate]);

  return isLoadingCard ? (
    //If the card is still loading, display the spinner "ClipLoader" for the user.
    <div className={styles[`spinner-container`]}>
      <ClipLoader
        size={120}
        color={"var(--color-accent-primary)"}
        speedMultiplier={0.75}
        cssOverride={{ borderWidth: ".5rem" }}
      />
      <h1 className={styles[`loading-header`]}>Loading...</h1>
    </div>
  ) : (
    //If the card is NOT loading, show the Card.
    <div className={styles[`displayList-container`]}>
      <h1 className={styles[`name-title`]}>
        {serverToClientName(activeCard.name)}
      </h1>
      <div className={styles[`btn-container`]}>
        <button onClick={handleChangeView} className={styles["view-btn"]}>
          {isGridView ? "List View" : "Grid View"}
        </button>
      </div>
      <BingoGrid key={`${activeCard.name}-grid`} isGridView={isGridView} />
    </div>
  );
};

export default DisplayList;
