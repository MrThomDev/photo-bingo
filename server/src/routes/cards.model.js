const path = require("path");
const fs = require("fs");
const masterBingoCardList = require("../bingo/masterList/bingoList");

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

function generateNewBingoCard(cardType) {
  const masterCopy = [...masterBingoCardList[cardType]];
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

function saveList(cardType, cardName, cardData) {
  const cardFilePath = path.join(
    __dirname,
    "..",
    "bingo",
    "lists",
    "cards.json"
  );

  try {
    const cards = readJsonFromFile(cardFilePath);

    if (!cards) {
      throw new Error("Could not read list from dicrectory");
    }

    if (cards[cardType][cardName]) {
      throw new Error(
        "This name already exists. Server rejected request to save."
      );
    }

    if (Array.isArray(cardData)) {
      cards[cardType][cardName] = cardData;
      writeJSONToFile(cardFilePath, cards);
      return { success: true, payload: cards[cardType][cardName] };
    } else {
      throw new Error("The submited data was not a valid array");
    }
  } catch (error) {
    console.error(error);
    return { success: false, payload: error.message };
  }
}

function updateList(cardType, cardName, updatedData) {
  const cardFilePath = path.join(
    __dirname,
    "..",
    "bingo",
    "lists",
    "cards.json"
  );

  const cards = readJsonFromFile(cardFilePath);
  if (Array.isArray(updatedData)) {
    try {
      if (!cards[cardType][cardName]) {
        throw new Error(
          `The name "${cardName}" could not be found. Update failed.`
        );
      }

      cards[cardType][cardName] = updatedData;
      writeJSONToFile(cardFilePath, cards);
      return { success: true, payload: cards[cardType][cardName] };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        payload: `List did not update. The following error was given:\n${error.message}`,
      };
    }
  }
}

function deleteList(cardType, cardName) {
  const cardFilePath = path.join(
    __dirname,
    "..",
    "bingo",
    "lists",
    "cards.json"
  );
  try {
    const cards = readJsonFromFile(cardFilePath);
    if (!cards[cardType][cardName]) {
      throw new Error(
        `Server could not find the card |${cardName}| in the card type of |${cardType}|`
      );
    }

    if (cards[cardType][cardName]) {
      const cardCopy = [...cards[cardType][cardName]];
      const allPhotoArr = [];
      cardCopy.forEach((cell, index) => {
        if (cell?.photos !== null) {
          cell.photos.forEach((photo) => {
            allPhotoArr.push(photo);
          });
        }
      });

      const destroyImgArrReq = destroyArrayImage(allPhotoArr);

      if (destroyImgArrReq.success === false) {
        throw new Error(
          `Could not delete images from card targeted for deletion. Server failure message: ${destroyImgArrReq.payload}`
        );
      }

      delete cards[cardType][cardName];
      writeJSONToFile(cardFilePath, cards);
      return { success: true, payload: cardCopy, photoArray: allPhotoArr };
    }
  } catch (error) {
    return { success: false, payload: error.message };
  }
}

function findAllListNames() {
  const listPath = path.join(__dirname, "..", "bingo", "lists", "cards.json");
  try {
    const jsonData = fs.readFileSync(listPath, "utf-8");
    const parsedData = JSON.parse(jsonData);
    const namesArray = [];
    for (let cardType in parsedData) {
      const cardTypeData = parsedData[cardType];
      for (let cardName in cardTypeData) {
        namesArray.push(cardName);
      }
    }

    if (namesArray.length === 0) {
      throw new Error(
        "There are no cards found. Have you created a new card yet?"
      );
    }

    return { success: true, payload: namesArray };
  } catch (error) {
    console.error(error);
    return { success: false, payload: error };
  }
}

function findAllCardNamesByType(cardType) {
  const listPath = path.join(__dirname, "..", "bingo", "lists", "cards.json");
  try {
    const jsonData = fs.readFileSync(listPath, "utf-8");
    const parsedData = JSON.parse(jsonData);
    const namesArray = [];

    if (
      typeof parsedData !== "object" ||
      !parsedData.hasOwnProperty(cardType)
    ) {
      throw new Error(`Card type "${cardType}" does not exist`);
    }

    for (let cardName in parsedData[cardType]) {
      namesArray.push(cardName);
    }

    if (namesArray.length === 0) {
      throw new Error(`There are no cards found in card type: ${cardType}`);
    }

    return { success: true, payload: namesArray };
  } catch (error) {
    console.error(error);
    return { success: false, payload: error };
  }
}

function pullBingoCard(cardType, cardName) {
  const bingoCardPath = path.join(
    __dirname,
    "..",
    "bingo",
    "lists",
    "cards.json"
  );
  try {
    const jsonBingoCard = fs.readFileSync(bingoCardPath, "utf-8");
    const parsedBingoCard = JSON.parse(jsonBingoCard);
    const targetBingoCard = parsedBingoCard[cardType][cardName];

    if (targetBingoCard === undefined) {
      throw new Error("No list of this name exists");
    }
    return { success: true, payload: targetBingoCard };
  } catch (error) {
    return { success: false, payload: error };
  }
}

function pullCardNamesByType(cardType) {
  const bingoCardPath = path.join(
    __dirname,
    "..",
    "bingo",
    "lists",
    "cards.json"
  );
  try {
    const jsonBingoCards = fs.readFileSync(bingoCardPath, "utf-8");
    const allBingoCard = JSON.parse(jsonBingoCards);
    const targetBingoCards = allBingoCard[cardType];

    if (targetBingoCards === undefined) {
      throw new Error(`No card type of |${cardType}| could be found`);
    }

    const namesArray = [];
    for (let name in targetBingoCards) {
      if (name !== undefined) {
        namesArray.push(name);
      }
    }

    if (namesArray.length === 0) {
      throw new Error(`There are no cards found under card type |${cardType}|`);
    }

    return { success: true, payload: namesArray };
  } catch (error) {
    return { success: false, payload: error };
  }
}

function pullAllCardTypes() {
  const bingoCardPath = path.join(
    __dirname,
    "..",
    "bingo",
    "lists",
    "cards.json"
  );
  try {
    const jsonBingoCards = fs.readFileSync(bingoCardPath, "utf-8");
    const allBingoCard = JSON.parse(jsonBingoCards);

    const typesArray = [];
    for (let type in allBingoCard) {
      if (type !== undefined) {
        typesArray.push(type);
      }
    }

    if (typesArray.length === 0) {
      throw new Error(
        `There are no cards types found. Either you have deleted everything or something has gone very wrong.`
      );
    }

    return { success: true, payload: typesArray };
  } catch (error) {
    return { success: false, payload: error };
  }
}

function pullCardTree() {
  const bingoCardPath = path.join(
    __dirname,
    "..",
    "bingo",
    "lists",
    "cards.json"
  );
  try {
    const jsonBingoCards = fs.readFileSync(bingoCardPath, "utf-8");
    const allBingoCard = JSON.parse(jsonBingoCards);

    const cardTree = {};
    for (let type in allBingoCard) {
      if (!cardTree[type]) {
        cardTree[type] = [];
      }
      for (let name in allBingoCard[type]) {
        cardTree[type].push(name);
      }

      if (cardTree[type].length === 0) {
        cardTree[type] = null;
      }
    }

    return { success: true, payload: cardTree };
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
  findAllCardNamesByType,
  pullBingoCard,
  pullCardNamesByType,
  pullAllCardTypes,
  pullCardTree,
};
