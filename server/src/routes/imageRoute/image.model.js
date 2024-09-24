const { error } = require("console");
const fs = require("fs").promises;
const path = require("path");

const photoFolderPath = path.join(__dirname, "..", "..", "images");

async function pullImage(targetImage) {
  const imagePath = path.join(photoFolderPath, `${targetImage}.jpg`);

  try {
    const image = await fs.readFile(imagePath);
    return { success: true, payload: image };
  } catch (error) {
    console.error(error);
  }
}

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

module.exports = {
  pullImage,
  pullImageArray,
  destroyImage,
  destroyArrayImage,
};
