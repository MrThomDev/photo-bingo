import { createContext } from "react";

import axios from "axios";

export const APIContext = createContext({
  serverURl: null,
  getAllCards: async () => null, //fetches list of all card names from server
  getCard: async () => null, //gets a specific card with it's data from server
  deleteCard: async () => null, //delets card and ALL of it's data from server
  makeCard: async () => null, //asks the server to make a random card and give it with a name the user provides. Returns new card.
  getPhotosOfArray: async () => null, //fetches a list of photo names (from an array) and returns photos
  deletePhoto: async () => null, //delets photo from server
  updateCard: async () => null, //updates a card with new data (the list of photo names in a cells array)
  savePhotos: async () => null, //saves photo files to server.
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
      return error;
    }
  }

  async function getCard(cardName) {
    try {
      if (!cardName || cardName === "") {
        throw new Error({ success: false, payload: "Invalid Card name given" });
      }

      const { data: fetchedCard } = await axios.get(
        `${serverUrl}/lists/list/name/${cardName}`
      );

      if (fetchedCard.success) {
        return fetchedCard;
      }

      if (!fetchedCard.success) {
        throw new Error(fetchedCard);
      }
    } catch (error) {
      return error;
    }
  }

  async function deleteCard(cardName) {
    try {
      const { data: deleteResponse } = await axios.delete(
        `${serverUrl}/lists/list/save/${cardName}`
      );

      if (deleteResponse.success === false) {
        throw new Error(deleteResponse.data);
      }

      if (deleteResponse.success) {
        return deleteResponse;
      }
    } catch (error) {
      console.error(
        `Server replied with the following error: ${error.payload}`
      );
      return error;
    }
  }

  async function makeCard(serverName) {
    try {
      const { data: newCardResponse } = await axios.post(
        `${serverUrl}/lists/list/newList/save/${serverName}`
      );

      if (newCardResponse.success === false) {
        throw new Error(newCardResponse);
      }

      if (newCardResponse.success) {
        return newCardResponse;
      }
    } catch (error) {
      console.error(error.payload);
      return error;
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
      return error;
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
      return error;
    }
  }

  async function updateCard(cardName, cardData) {
    try {
      const { data: response } = await axios.put(
        `${serverUrl}/lists/list/update/${cardName}`,
        cardData
      );

      if (response.success === false) {
        throw new Error(response);
      }

      if (response.success) {
        return response;
      }
    } catch (error) {
      return error;
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
      return error;
    }
  }

  const value = {
    serverUrl,
    getAllCards,
    getCard,
    deleteCard,
    makeCard,
    getPhotosOfArray,
    deletePhoto,
    updateCard,
    savePhotos,
  };
  return <APIContext.Provider value={value}>{children}</APIContext.Provider>;
};
