//image.router.js organizes endpoints for the image API and assigns functions to them from image.controlller.js

const express = require("express");
const multerSave = require("../../services/multer.config");

const imageRouter = express.Router();

//These imported functions are how the HTML response is handeled.
const {
  saveImagePostRequest,
  photoArrayPostRequest,
  getimage,
  getImageArray,
  deleteImage,
} = require("./image.controller");

imageRouter.get("/image/:imageName", getimage); //Returns a singular image from given image name
imageRouter.get("/array", getImageArray); //Returns an ararry of images from given array of image names

//Save a singular image
imageRouter.post(
  "/image/save/:imageName",
  multerSave.single("image"),
  saveImagePostRequest
);

//save an array of images
imageRouter.post(
  "/save",
  multerSave.array("images", 10),
  photoArrayPostRequest
);

imageRouter.delete("/image/delete/:imageName", deleteImage); //Delete an image from given image name

//export this router so that app.js can use it.
module.exports = imageRouter;
