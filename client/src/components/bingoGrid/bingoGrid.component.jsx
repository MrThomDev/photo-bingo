//This component is the heart of how the card is visualized. It is a CSS grid. Each cell of that grid has the challenge and photo information.

import { useEffect, useContext } from "react";
import BingoCell from "./bingoCell.component";

import { toast, Slide } from "react-toastify";

import { CardContext } from "../../contexts/card.context";

import styles from "./bingoGrid.style.module.css";
import StarIcon from "../../icons/start.icon";

const BingoGrid = ({ isGridView }) => {
  const { activeCard, dummyUpdate } = useContext(CardContext);

  //This useEffect checks to see if there is any data in the CardContext to visualize.
  useEffect(() => {
    if (!activeCard || !activeCard.cells) {
      toast.error(
        `There was an error in displaying the Card. A refresh may be needed`,
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
            background: "linear-gradient(to right, #e68600, #ff9500, #ffa01a)",
          },
        }
      );
    }
  }, [activeCard, dummyUpdate]);

  return (
    <div
      className={`${styles["bingo-grid-container"]} ${
        isGridView ? styles["grid-view"] : styles["list-view"]
      }`}
    >
      <div
        className={`${styles[`freeSpace`]} ${
          !isGridView ? styles[`hide`] : ""
        }`}
      >
        <StarIcon className={`${styles[`starIcon`]}`} />
      </div>

      {activeCard.cells.map((el, index) => {
        return (
          <BingoCell
            key={`Cell-${index}`}
            index={index}
            isGridView={isGridView}
          />
        );
      })}
    </div>
  );
};

export default BingoGrid;
