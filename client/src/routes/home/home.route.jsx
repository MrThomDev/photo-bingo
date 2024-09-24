import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

import { toast, Slide } from "react-toastify";

import { APIContext } from "../../contexts/api.context";

import RefreshIcon from "../../icons/refresh.icon";

import styles from "./home.style.module.css";

const Home = () => {
  const [listNames, setListNames] = useState([]);
  const [fetchFailed, setFetchFailed] = useState(false);
  const { getAllCards } = useContext(APIContext);

  const serverToClientName = (name) => {
    const clientSafeName = name.replaceAll("_", " ");
    return clientSafeName;
  };

  useEffect(() => {
    const fetchCards = async () => {
      const { success, payload: cards } = await getAllCards();
      setListNames(cards);
      setFetchFailed(!success);

      if (!success) {
        console.error(cards);
        toast.error(
          `Failed to retrive card names from server. Failure message: "${
            !cards
              ? "There is a problem with the connection. Could not reach server."
              : cards
          }"`,
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
        setFetchFailed(true);
      }
    };

    fetchCards();
  }, []);

  const fetchFail = (
    <div className={styles[`fetch-fail`]}>
      Connection <b>failed</b>. <em>Refresh </em>
      <RefreshIcon className={styles[`refresh-icon`]} /> needed.
    </div>
  );

  return (
    <div className={styles[`home-page-container`]}>
      <header>
        <h1
          className={`${styles[`page-title`]} ${styles[`extended-underline`]}`}
        >
          Japan Photo Bingo
        </h1>
        <p className={`${styles[`game-description`]}`}>
          The game is simple. Make a new card and give it a name. Be on the
          lookout for the challenges in each cell as you explore Japan. Submit a
          picture (or many) to complete the challenge!
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
        <div className={`${styles[`game-list-container`]}`}>
          <h2 className={styles[`card-List-title`]}>Existing Cards</h2>
          {fetchFailed
            ? fetchFail
            : listNames.map((name) => {
                return (
                  <Link
                    key={name}
                    to={`/list/${name}`}
                    className={styles[`link`]}
                  >
                    {serverToClientName(name)}
                  </Link>
                );
              })}
        </div>
      </main>
    </div>
  );
};

export default Home;
