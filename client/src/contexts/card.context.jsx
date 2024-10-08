import { useState, createContext } from "react";

export const CardContext = createContext({
  CardCell: null, //Custom class that defines the data structure of each cell
  Card: null, //Custom class that defines the data structure of the card recieved from the server
  activeCard: null, //This is an instance of the Card class. This is how React will interact with all local Card data.
  setActiveCard: () => null, //The useState setter for activeCard
  dummyUpdate: null, //Because it is less effcient to use setActiveCard every time there is a change in data, we use this dummy update to triger rerenders so that the correct data is still displayed.
  setDummyUpdate: () => null, //the useState setter for dummyUpdate. To use less imports, you can call the activeCard.reRender() method which will update dummyUpdate and cause the rerender this is meant for.
  cardTypes: [null], //store all cardtypes when page first loads
  setCardTypes: () => null, //Sets cardTypes
  cardTree: {},
  setCardTree: () => null,
});

export const CardProvider = ({ children }) => {
  const [activeCard, setActiveCard] = useState(null);
  const [dummyUpdate, setDummyUpdate] = useState(0);
  const [cardTypes, setCardTypes] = useState([null]);
  const [cardTree, setCardTree] = useState({});

  const checkArray = (array) => {
    if (Array.isArray(array) === false) {
      throw new Error(
        "The input was not an array. Only arrays are valid inputs for this function."
      );
    }
  };

  const checkIndex = (index, length = null) => {
    if (typeof index !== "number") {
      throw new Error(
        "The inputed index is not a number. Only numbers are valid inputs for this function"
      );
    }

    if (length !== null) {
      if (index + 1 > length) {
        throw new Error(
          "The index given is larger than the length of the array."
        );
      }
    }
  };

  class CardCell {
    constructor(challenge, photos) {
      this.challenge = challenge;
      this.photos = photos;
    }

    addPhotos(nameArr) {
      try {
        checkArray(nameArr);

        if (this.photos === null) {
          this.photos = nameArr;
        } else {
          this.photos.push(...nameArr);
        }
        setDummyUpdate((old) => old + 1);
      } catch (error) {
        console.error(
          `Could not add photos. The following error was given: ${error}`
        );
      }
    }

    addPhoto(photoName) {
      try {
        if (typeof photoName !== "string") {
          throw new Error("The input was not a string. Photo not added");
        }

        if (this.photos === null) {
          this.photos = [photoName];
        } else {
          this.photos.push(photoName);
        }
        setDummyUpdate((old) => old + 1);
      } catch (error) {
        console.error(error);
      }
    }

    updatePhotos(newPhotos) {
      try {
        checkArray(newPhotos);

        this.photos = newPhotos;
        setDummyUpdate((old) => old + 1);
      } catch (error) {
        console.error(
          `Could not update photo array. The following error was given: ${error}`
        );
      }
    }

    deletePhoto(index) {
      try {
        checkIndex(index, this.photos.length);

        this.photos.splice(index, 1);

        if (this.photos.length === 0) {
          this.photos = null;
        }
        setDummyUpdate((old) => old + 1);
      } catch (error) {
        console.error(error);
      }
    }
  }

  class Card {
    constructor(cardType, cardName, cellArray) {
      const classArray = cellArray.map((cell, index) => {
        return new CardCell(cell.challenge, cell.photos, index);
      });

      this.type = cardType;
      this.name = cardName;
      this.cells = classArray;
    }

    cell(index) {
      try {
        checkIndex(index, this.cells.length);

        return this.cells[index];
      } catch (error) {
        console.log(error);
      }
    }

    toArray() {
      return this.cells.map((cell) => {
        return {
          challenge: cell.challenge,
          photos: cell.photos,
        };
      });
    }

    reRender() {
      setDummyUpdate((old) => old + 1);
    }
  }

  const value = {
    activeCard,
    setActiveCard,
    dummyUpdate,
    setDummyUpdate,
    CardCell,
    Card,
    cardTypes,
    setCardTypes,
    cardTree,
    setCardTree,
  };
  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
};
