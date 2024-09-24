const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, path.join(__dirname, "..", "images"));
  },

  filename: (req, file, callBack) => {
    // const reqName = req.params.imageName;
    // const saveName = `${reqName}${file.originalname.slice(
    //   file.originalname.lastIndexOf(".")
    // )}`;
    callBack(null, file.originalname);
  },
});

const multerSave = multer({ storage: storage });

module.exports = multerSave;
