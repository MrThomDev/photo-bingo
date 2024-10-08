const express = require("express");

const cardsRouter = express.Router();

const {
  getMasterList,
  getAllCardTypes,
  getCardTree,
  getAllCardNames,
  getCardNamesByType,
  getCard,
  saveNewCardPostRequest,
  // saveListPostRequest,
  cardPutRequest,
  deleteCardRequest,
} = require("./cards.controller");

cardsRouter.get("/masterList", getMasterList); //returns an object that has all card types with their respective challenges

cardsRouter.get("/cardTypes", getAllCardTypes); //returns an array of all card types

cardsRouter.get("/cardTree", getCardTree); //Returns an object that keys are the card types and each type contains an object that keys are card names.

cardsRouter.get("/names/all", getAllCardNames); //returns all card names from all card types

cardsRouter.get("/names/:cardType", getCardNamesByType); // returns all names of a specified card type

cardsRouter.get("/card/:cardType/:cardName", getCard); //gets a specific card from a specific card type

//

cardsRouter.post("/card/newCard/:cardType/:cardName", saveNewCardPostRequest); //generates a new card, saves it, and sends it to the client.

// cardsRouter.post("/card/save/:cardName", saveListPostRequest);

cardsRouter.put("/card/update/:cardType/:cardName", cardPutRequest); //updates a card on the server

cardsRouter.delete("/card/delete/:cardType/:cardName", deleteCardRequest); //deletes a card AND all of it's photos

module.exports = cardsRouter;
