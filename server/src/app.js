const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

const listsRouter = require("./routes/lists.router");
const imageRouter = require("./routes/imageRoute/image.router");

app.use(
  cors({
    origin: "http://localhost:3000", //this is the default port for reacts local development instance. If you have not built the front end and placed it on the server, you will need to use cors to allow for the different orgin
  })
);

app.use(express.json());

const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));
app.use("/lists", listsRouter);
app.use("/images", imageRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    payload:
      "You have tried to reach an endpoint that does not exist. Check the address and try again",
  });
});

module.exports = app;
