const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

//This app organizes it's endpoints into express routes. There are two main data types we are dealing with. Cards and images.
const cardsRouter = require("./routes/cardsRoute/cards.router");
const imageRouter = require("./routes/imageRoute/image.router");

//This cors origin configuration is only neccessary if in development mode. It is not needed for production and would should be removed.
app.use(
  cors({
    origin: "http://localhost:3000", //this is the default port for reacts local development instance. If you have not built the front end and placed it on the server, you will need to use cors to allow for the different orgin
  })
);

app.use(express.json());

const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath)); //server the public path. This is the react build.
app.use("/cards", cardsRouter); //The API endpoint for all requests related to cards
app.use("/images", imageRouter); //The API endpoint for all requests related to images

//A catch all for wrong endpoint requests
app.use((req, res) => {
  res.status(404).json({
    success: false,
    payload:
      "You have tried to reach an endpoint that does not exist. Check the address and try again",
  });
});

module.exports = app;
