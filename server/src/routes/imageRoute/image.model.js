// image.model.js handels the fetching and manipulation of all data for the image API.

const { error } = require("console");
const fs = require("fs").promises; //This module handles the reading of and the writting to the drive. This is the promise version of FS so BE MINDFUL of ASYNC behaviors
const path = require("path"); //Allows us to have an environment independent way to navigate the drive

const photoFolderPath = path.join(__dirname, "..", "..", "images"); //The path images are saved.

//get a single image
async function pullImage(targetImage) {
  const imagePath = path.join(photoFolderPath, `${targetImage}.jpg`);

  try {
    const image = await fs.readFile(imagePath);
    return { success: true, payload: image };
  } catch (error) {
    console.error(error);
  }
}

//get an array of images
async function pullImageArray(imageArray) {
  if (!Array.isArray(imageArray)) {
    return {
      success: false,
      payload:
        "Images must be requested in the format of a list of names inside an array. This request did not use an array. Request rejected.",
    };
  }
  const photoPromises = imageArray.map(async (photoName) => {
    try {
      const photoPath = path.join(photoFolderPath, `${photoName}`);
      const photoData = await fs.readFile(photoPath, "base64");
      return { photoName, data: photoData, success: true };
    } catch (error) {
      console.error(error);
      if (error.code === "ENOENT") {
        return { photoName, data: "photo not found", success: false };
      }
      return { photoName, data: error, success: true };
    }
  });

  const photos = await Promise.all(photoPromises);

  return { success: true, payload: photos };
}

//delete an image
async function destroyImage(targetImage) {
  try {
    const photoFilePath = path.join(photoFolderPath, `${targetImage}`);

    await fs.unlink(photoFilePath);
    return { success: true, payload: targetImage };
  } catch (error) {
    console.error(error);
    return { success: false, payload: error };
  }
}

//delete an array of images
async function destroyArrayImage(array) {
  try {
    if (Array.isArray(array) === false) {
      throw new Error(
        `The given input of "${array}" is not a valid array. Request rejected.`
      );
    }

    for (let i = 0; i < array.length; i++) {
      const photoFilePath = path.join(photoFolderPath, `${array[i]}`);

      await fs.unlink(photoFilePath);
    }
    return { success: true, payload: "Array destoryed" };
  } catch (error) {
    return { success: false, payload: error };
  }
}

//export these functions so that the controller can use them
module.exports = {
  pullImage,
  pullImageArray,
  destroyImage,
  destroyArrayImage,
};
