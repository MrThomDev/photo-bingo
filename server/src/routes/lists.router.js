const express = require("express");

const listsRouter = express.Router();

const {
  getMasterList,
  getNewList,
  getAllListNames,
  getList,
  saveNewListPostRequest,
  saveListPostRequest,
  listPutRequest,
  deleteListRequest,
} = require("./lists.controller");

listsRouter.get("/masterList", getMasterList);
listsRouter.get("/newList", getNewList);
listsRouter.get("/names/all", getAllListNames);
listsRouter.get("/list/name/:listName", getList);

listsRouter.post("/list/newList/save/:listName", saveNewListPostRequest);
listsRouter.post("/list/save/:listName", saveListPostRequest);

listsRouter.put("/list/update/:listName", listPutRequest);

listsRouter.delete("/list/save/:listName", deleteListRequest);

module.exports = listsRouter;
