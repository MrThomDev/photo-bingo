const http = require("http");
const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 8421;

const server = http.createServer(app);

server.listen(PORT, () => {
  if (PORT) {
    console.log(`Server launched.\nListening on port: ${PORT}`);
  } else {
    console.error(
      "Failed to use port number given. It is likely that either the port inputed was an invalid data type or that port was not properly defined"
    );
  }
});
