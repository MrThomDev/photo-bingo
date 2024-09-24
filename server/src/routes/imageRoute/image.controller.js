const { destroyImage, pullImage, pullImageArray } = require("./image.model");

function saveImagePostRequest(req, res) {
  try {
    res.status(201).send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false });
  }
}

function photoArrayPostRequest(req, res) {
  try {
    res.status(201).send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false });
  }
}

async function getimage(req, res) {
  const photo = await pullImage(req.params.imageName);
  if (photo.success) {
    res.setHeader("Content-Type", "image/jpeg").status(200).send(photo.payload);
  } else {
    res.status(404).json(photo.payload);
  }
}

async function getImageArray(req, res) {
  const { imageNames } = req.query;
  const images = await pullImageArray(imageNames);
  if (images.success) {
    return res.send(images);
  }
  if (!images.success) {
    return res.status(400).json(images);
  }
}

async function deleteImage(req, res) {
  try {
    const targetImage = req.params.imageName;
    const destroyReply = await destroyImage(targetImage);

    return res.status(200).send(destroyReply);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, payload: error });
  }
}

module.exports = {
  saveImagePostRequest,
  photoArrayPostRequest,
  getimage,
  getImageArray,
  deleteImage,
};
