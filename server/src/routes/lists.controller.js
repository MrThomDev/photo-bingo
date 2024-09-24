const bingoMasterArray = require("../bingo/masterList/bingoList");
const {
  generateNewBingoCard,
  saveList,
  updateList,
  deleteList,
  findAllListNames,
  pullBingoCard,
} = require("./lists.model");

function getMasterList(req, res) {
  res.status(200).send(bingoMasterArray);
}

function getNewList(req, res) {
  res.status(200).send(generateNewBingoCard());
}

function getAllListNames(req, res) {
  const listNames = findAllListNames();
  if (listNames.success) {
    return res.status(200).json(listNames);
  }

  if (listNames.success === false) {
    return res.status(400).send(listNames);
  }
}

function getList(req, res) {
  const name = req.params.listName;
  const bingoCard = pullBingoCard(name);
  if (bingoCard.success === false) {
    return res.status(404).json(bingoCard);
  }
  return res.status(200).json(bingoCard);
}

function saveNewListPostRequest(req, res) {
  const cardName = req.params.listName;
  const regex = /^[a-zA-Z0-9_]*$/;
  const regTest = regex.test(cardName);

  const nameExist = pullBingoCard(cardName);
  if (nameExist.success) {
    return res.status(400).send({
      success: false,
      payload: `The bingo card name "${cardName}" already exists. New list NOT made.`,
    });
  }

  if (cardName.length <= 0 || !regTest) {
    return res.status(400).send({
      success: false,
      payload: "Name sent is an invalid format",
    });
  }

  const newBingoCard = generateNewBingoCard();
  const saveResponse = saveList(cardName, newBingoCard);

  if (saveResponse.success) {
    res.status(201).send(saveResponse);
  } else {
    res.status(400).send(saveResponse);
  }
}

function saveListPostRequest(req, res) {
  const listName = req.params.listName;
  const bodyData = req.body;
  const updatedList = saveList(listName, bodyData);

  if (updatedList.success) {
    res.status(200).send(updatedList);
  } else {
    res.status(400).send(updatedList);
  }
}

function listPutRequest(req, res) {
  const listName = req.params.listName;
  const bodyData = req.body;
  const updatedList = updateList(listName, bodyData);

  if (updatedList.success) {
    res.status(200).send(updatedList);
  } else {
    res.status(400).send(updatedList);
  }
}

function deleteListRequest(req, res) {
  const listName = req.params.listName;
  const deleteResponse = deleteList(listName);

  if (deleteResponse.success) {
    res.status(200).send(deleteResponse);
  } else {
    res
      .status(400)
      .send({ success: false, payload: `Failed to delete: ${listName}` });
  }
}

module.exports = {
  getMasterList,
  getNewList,
  getAllListNames,
  getList,
  saveNewListPostRequest,
  saveListPostRequest,
  listPutRequest,
  deleteListRequest,
};
