import { createContext } from "react";

import { Slide } from "react-toastify";

import axios from "axios";

export const APIContext = createContext({
  serverURl: null,
  getAllCards: async () => null, //fetches list of all card names from server
  getAllCardTypes: async () => null, // returns an array with all card types as strings
  getCardTree: async () => null, // fetches a JS object thats keys are card types. Each card Type has an array of card names belonging to that type
  getNamesByType: async () => null, //returns all card names of specified type
  getCard: async () => null, //gets a specific card with it's data from server
  deleteCard: async () => null, //delets card and ALL of it's data from server
  makeCard: async () => null, //asks the server to make a random card and give it with a name the user provides. Returns new card.
  getPhotosOfArray: async () => null, //fetches a list of photo names (from an array) and returns photos
  deletePhoto: async () => null, //delets photo from server
  updateCard: async () => null, //updates a card with new data (the list of photo names in a cells array)
  savePhotos: async () => null, //saves photo files to server.
  toastStyle: {},
});

export const APIProvider = ({ children }) => {
  const serverUrl =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_SERVER_URL
      : "";

  async function getAllCards() {
    try {
      const { data: namesResponse } = await axios.get(
        `${serverUrl}/lists/names/all`
      );
      if (namesResponse.success) {
        return namesResponse;
      }

      if (namesResponse.success === false) {
        throw new Error(namesResponse);
      }
    } catch (error) {
      console.error(error);
      return error.response.data;
    }
  }

  async function getAllCardTypes() {
    try {
      const { data: typesResponse } = await axios.get(
        `${serverUrl}/cards/cardTypes`
      );

      if (!typesResponse.success) {
        throw new Error(typesResponse);
      }

      if (typesResponse.success) {
        return typesResponse;
      }
    } catch (error) {
      return error.response.data;
    }
  }

  async function getCardTree() {
    try {
      const { data: cardTreeResponse } = await axios.get(
        `${serverUrl}/cards/cardTree`
      );

      return cardTreeResponse;
    } catch (error) {
      return error.response.data;
    }
  }

  async function getNamesByType(cardType) {
    try {
      const { data: cardNames } = await axios.get(
        `${serverUrl}/cards/names/${cardType}`
      );

      if (!cardNames.success) {
        throw new Error(cardNames.payload);
      }

      return cardNames;
    } catch (error) {
      console.error(`Failed to fetch card names by type.`);
      return error.response.data;
    }
  }

  async function getCard(cardType, cardName) {
    try {
      if (!cardType || cardType === "") {
        throw new Error({ success: false, payload: "Invalid Card type given" });
      }
      if (!cardName || cardName === "") {
        throw new Error({ success: false, payload: "Invalid Card name given" });
      }

      const { data: fetchedCard } = await axios.get(
        `${serverUrl}/cards/card/${cardType}/${cardName}`
      );

      if (fetchedCard.success) {
        return fetchedCard;
      }

      if (!fetchedCard.success) {
        throw new Error(fetchedCard);
      }
    } catch (error) {
      return error.response.data;
    }
  }

  async function deleteCard(cardType, cardName) {
    try {
      const { data: deleteResponse } = await axios.delete(
        `${serverUrl}/cards/card/delete/${cardType}/${cardName}`
      );

      if (deleteResponse.success === false) {
        throw new Error(deleteResponse.data);
      }

      if (deleteResponse.success) {
        return deleteResponse;
      }
    } catch (error) {
      console.error(
        `Server replied with the following error: ${error.response.data.payload}`
      );
      return error.response.data;
    }
  }

  async function makeCard(cardType, serverName) {
    try {
      const { data: newCardResponse } = await axios.post(
        `${serverUrl}/cards/card/newCard/${cardType}/${serverName}`
      );

      if (newCardResponse.success === false) {
        throw new Error(newCardResponse);
      }

      if (newCardResponse.success) {
        return newCardResponse;
      }
    } catch (error) {
      console.error(error.response.data);
      return error.response.data;
    }
  }

  async function getPhotosOfArray(photoArr) {
    try {
      const { data: fetchResponse } = await axios.get(
        `${serverUrl}/images/array`,
        {
          params: { imageNames: photoArr },
        }
      );

      if (fetchResponse.success === false) {
        throw new Error(fetchResponse);
      }

      if (fetchResponse.success) {
        return fetchResponse;
      }
    } catch (error) {
      return error.response.data;
    }
  }

  async function deletePhoto(photoName) {
    try {
      const { data: deleteResponse } = await axios.delete(
        `${serverUrl}/images/image/delete/${photoName}`
      );
      if (deleteResponse.success === true) {
        console.log(`Deleted Photo: ${photoName}`);
        return deleteResponse;
      }

      if (deleteResponse.success === false) {
        throw new Error(deleteResponse);
      }
    } catch (error) {
      return error.response.data;
    }
  }

  async function updateCard(cardType, cardName, cardData) {
    try {
      const { data: response } = await axios.put(
        `${serverUrl}/cards/card/update/${cardType}/${cardName}`,
        cardData
      );

      if (response.success === false) {
        throw new Error(response);
      }

      if (response.success) {
        return response;
      }
    } catch (error) {
      return error.response.data;
    }
  }

  async function savePhotos(formData) {
    try {
      const { data: photoResponse } = await axios.post(
        `${serverUrl}/images/save`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (photoResponse.success === false) {
        throw new Error(photoResponse);
      }

      if (photoResponse.success === true) {
        console.info(`The server accepted photo upload`);
        return photoResponse;
      }
    } catch (error) {
      return error.response.data;
    }
  }

  const toastStyle = {
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
  };

  const value = {
    serverUrl,
    getAllCards,
    getAllCardTypes,
    getCardTree,
    getNamesByType,
    getCard,
    deleteCard,
    makeCard,
    getPhotosOfArray,
    deletePhoto,
    updateCard,
    savePhotos,
    toastStyle,
  };
  return <APIContext.Provider value={value}>{children}</APIContext.Provider>;
};
