const bingoMasterArray = require("../bingo/masterList/bingoList");
const {
  generateNewBingoCard,
  saveList,
  updateList,
  deleteList,
  findAllListNames,
  pullBingoCard,
  pullCardNamesByType,
  pullAllCardTypes,
  pullCardTree,
} = require("./cards.model");

function getMasterList(req, res) {
  res.status(200).send(bingoMasterArray);
}

function getAllCardTypes(req, res) {
  const cardTypes = pullAllCardTypes();

  if (cardTypes.success) {
    return res.status(200).send(cardTypes);
  }

  if (!cardTypes.success) {
    return res.status(400).send(cardTypes);
  }
}

function getCardTree(req, res) {
  const cardTree = pullCardTree();

  res.status(200).send(cardTree);
}

function getAllCardNames(req, res) {
  const cardNames = findAllListNames();
  if (cardNames.success) {
    return res.status(200).json(cardNames);
  }

  if (cardNames.success === false) {
    return res.status(400).send(cardNames);
  }
}

function getCardNamesByType(req, res) {
  const cardType = req.params.cardType;
  const cardNames = pullCardNamesByType(cardType);

  if (cardNames.success) {
    return res.status(200).send(cardNames);
  }

  if (!cardNames.success) {
    return res.status(400).send(cardNames);
  }
}

function getCard(req, res) {
  const cardType = req.params.cardType;
  const cardName = req.params.cardName;
  console.log("Controller activated");
  const bingoCard = pullBingoCard(cardType, cardName);
  if (bingoCard.success === false) {
    return res.status(404).json(bingoCard);
  }
  return res.status(200).json(bingoCard);
}

function saveNewCardPostRequest(req, res) {
  const cardType = req.params.cardType;
  const cardName = req.params.cardName;
  const regex = /^[a-zA-Z0-9_]*$/;
  const regTest = regex.test(cardName);

  if (cardName.length <= 0 || !regTest) {
    return res.status(400).send({
      success: false,
      payload: "Name sent is an invalid format",
    });
  }

  const nameExist = pullBingoCard(cardType, cardName);
  if (nameExist.success) {
    return res.status(400).send({
      success: false,
      payload: `The bingo card name "${cardName}" already exists. New list NOT made.`,
    });
  }

  const newBingoCard = generateNewBingoCard(cardType);
  const saveResponse = saveList(cardType, cardName, newBingoCard);

  if (saveResponse.success) {
    return res.status(201).send(saveResponse);
  } else {
    return res.status(400).send(saveResponse);
  }
}

function cardPutRequest(req, res) {
  const cardType = req.params.cardType;
  const cardName = req.params.cardName;
  const cardUpdateData = req.body;
  const updatedList = updateList(cardType, cardName, cardUpdateData);

  if (updatedList.success) {
    res.status(200).send(updatedList);
  } else {
    res.status(400).send(updatedList);
  }
}

function deleteCardRequest(req, res) {
  const cardType = req.params.cardType;
  const cardName = req.params.cardName;
  const deleteResponse = deleteList(cardType, cardName);

  if (deleteResponse.success) {
    return res.status(200).send(deleteResponse);
  } else {
    return res.status(400).send(deleteResponse);
  }
}

module.exports = {
  getMasterList,
  getAllCardTypes,
  getCardTree,
  getAllCardNames,
  getCardNamesByType,
  getCard,
  saveNewCardPostRequest,
  cardPutRequest,
  deleteCardRequest,
};
