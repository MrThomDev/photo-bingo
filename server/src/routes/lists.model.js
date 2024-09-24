const path = require("path");
const fs = require("fs");
const bingoMasterArray = require("../bingo/masterList/bingoList");

const { destroyArrayImage } = require("./imageRoute/image.model");

class BingoCellData {
  constructor(challenge, photoArray) {
    this.challenge = challenge;
    this.photos = photoArray;
  }
}

function randomNumToX(maxNum) {
  const randomDecimal = Math.random();
  return Math.floor(randomDecimal * maxNum);
}

function readJsonFromFile(path) {
  try {
    const jsonData = fs.readFileSync(path, "utf-8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

function writeJSONToFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function generateNewBingoCard() {
  const masterCopy = [...bingoMasterArray];
  const bingoCard = [];

  for (let i = 0; i < 24; i++) {
    let newChallengeIndex = randomNumToX(masterCopy.length);

    const bingoCell = new BingoCellData(
      ...masterCopy.splice(newChallengeIndex, 1),
      null
    );

    bingoCard.push(bingoCell);
  }
  return bingoCard;
}

function saveList(listName, newData) {
  const listFilePath = path.join(
    __dirname,
    "..",
    "bingo",
    "lists",
    "lists.json"
  );

  try {
    const lists = readJsonFromFile(listFilePath);

    if (!lists) {
      throw new Error("Could not read list from dicrectory");
    }

    if (Array.isArray(newData)) {
      lists[listName] = newData;
      writeJSONToFile(listFilePath, lists);
      return { success: true, payload: lists };
    } else {
      throw new Error("The submited data was not a valid array");
    }
  } catch (error) {
    console.error(error);
    return { success: false, payload: error };
  }
}

function updateList(listName, updatedData) {
  const listFilePath = path.join(
    __dirname,
    "..",
    "bingo",
    "lists",
    "lists.json"
  );

  const lists = readJsonFromFile(listFilePath);
  if (Array.isArray(updatedData)) {
    try {
      if (!lists[listName]) {
        throw new Error("This list name could not be found");
      }

      if (!lists[listName]) {
        throw new Error(
          `The name "${listName}" could not be found. Update failed.`
        );
      }
      lists[listName] = updatedData;
      writeJSONToFile(listFilePath, lists);
      return { success: true, payload: lists[listName] };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        payload: `List did not update. The following error was given:\n${error}`,
      };
    }
  }
}

function deleteList(listName) {
  const listFilePath = path.join(
    __dirname,
    "..",
    "bingo",
    "lists",
    "lists.json"
  );
  try {
    const lists = readJsonFromFile(listFilePath);
    if (!lists[listName]) {
      throw new Error("Server couldn't not delete requested list");
    }

    if (lists[listName]) {
      const copy = lists[listName];
      const allPhotoArr = [];
      copy.forEach((el) => {
        if (el?.photos !== null) {
          el.photos.forEach((photo) => {
            allPhotoArr.push(photo);
          });
        }
      });
      console.info("Deleted", allPhotoArr);

      const destroyImgArrReq = destroyArrayImage(allPhotoArr);

      if (destroyImgArrReq.success === false) {
        throw new Error(
          "Could not delete images from list targeted for deletion"
        );
      }

      delete lists[listName];
      writeJSONToFile(listFilePath, lists);
      return { success: true, payload: copy, photoArray: allPhotoArr };
    }
  } catch (error) {
    return { success: false, payload: error };
  }
}

function findAllListNames() {
  const listPath = path.join(__dirname, "..", "bingo", "lists", "lists.json");
  try {
    const jsonData = fs.readFileSync(listPath, "utf-8");
    const parsedData = JSON.parse(jsonData);
    const namesArray = [];
    for (let name in parsedData) {
      namesArray.push(name);
    }
    return { success: true, payload: namesArray };
  } catch (error) {
    console.error(error);
    return { success: false, payload: error };
  }
}

function pullBingoCard(name) {
  const bingoCardPath = path.join(
    __dirname,
    "..",
    "bingo",
    "lists",
    "lists.json"
  );
  try {
    const jsonBingoCard = fs.readFileSync(bingoCardPath, "utf-8");
    const parsedBingoCard = JSON.parse(jsonBingoCard);
    const targetBingoCard = parsedBingoCard[name];
    if (targetBingoCard === undefined) {
      throw new Error("No list of this name exists");
    }
    return { success: true, payload: targetBingoCard };
  } catch (error) {
    return { success: false, payload: error };
  }
}

module.exports = {
  generateNewBingoCard,
  saveList,
  updateList,
  deleteList,
  findAllListNames,
  pullBingoCard,
};
