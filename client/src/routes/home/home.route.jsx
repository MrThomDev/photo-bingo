//The landing page of the app. It gives the client the basic options of viewing an existing card, creating a card, or deleting a card.

import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";

//Import our contexts so we can access data outside the scope of this component.
import { APIContext } from "../../contexts/api.context";
import { CardContext } from "../../contexts/card.context";

import DropDownCard from "../../components/dropDown/dropDown.card";

import styles from "./home.style.module.css";

const Home = () => {
  const { getCardTree, toastStyle } = useContext(APIContext);
  const { setCardTypes, cardTree, setCardTree } = useContext(CardContext);

  //This useEffect uses an async call to the server to get which card types are available and what card names are assoicated with each card type. It then saves that data in the cardContext scope.
  useEffect(() => {
    const fetchCards = async () => {
      const { success: cardTreeSuccess, payload: cardTree } =
        await getCardTree();

      if (!cardTreeSuccess) {
        console.error(cardTree);
        toast.error(
          `Failed to retrive card types and names from server. Failure message: "${
            !cardTree
              ? "There is a problem with the connection. Could not reach server."
              : cardTree
          }"`,
          toastStyle
        );
        return;
      }
      setCardTree(cardTree);
    };

    fetchCards();
  }, []);

  useEffect(() => {
    setCardTypes(Object.keys(cardTree));
  }, [cardTree]);

  return (
    <div className={styles[`home-page-container`]}>
      <header>
        <h1
          className={`${styles[`page-title`]} ${styles[`extended-underline`]}`}
        >
          Photo Bingo
        </h1>
        <p className={`${styles[`game-description`]}`}>
          The game is simple. Make a new card and give it a name. Be on the
          lookout for the challenges in each cell as you explore your chosen
          destination . Submit a picture (or many) to complete the challenge!
        </p>
      </header>
      <main>
        <div className={styles[`btn-box`]}>
          <Link
            className={`${styles[`link`]} ${styles[`btn`]} ${
              styles[`new-btn`]
            }`}
            to="/newCard"
          >
            New Card
          </Link>
          <Link
            className={`${styles[`link`]} ${styles[`btn`]} ${
              styles[`delete-btn`]
            }`}
            to="/deleteLists"
          >
            Delete Card
          </Link>
        </div>
        <h2 className={styles[`cards-header`]}>Existing Cards</h2>
        <div className={styles[`cards-container`]}>
          {Object.keys(cardTree).map((type) => {
            return (
              <DropDownCard
                key={`${type}`}
                cardType={type}
                typeNames={cardTree[type]}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Home;
