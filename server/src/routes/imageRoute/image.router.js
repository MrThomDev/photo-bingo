const express = require("express");
const multerSave = require("../../services/multer.config");

const imageRouter = express.Router();

const {
  saveImagePostRequest,
  photoArrayPostRequest,
  getimage,
  getImageArray,
  deleteImage,
} = require("./image.controller");

imageRouter.get("/image/:imageName", getimage);
imageRouter.get("/array", getImageArray);

imageRouter.post(
  "/image/save/:imageName",
  multerSave.single("image"),
  saveImagePostRequest
);
imageRouter.post(
  "/save",
  multerSave.array("images", 10),
  photoArrayPostRequest
);

imageRouter.delete("/image/delete/:imageName", deleteImage);

module.exports = imageRouter;
