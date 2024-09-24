const http = require("http");
const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || undefined;

const server = http.createServer(app);

server.listen(PORT, () => {
  if (PORT) {
    console.log(`Server launched.\nListening on port: ${PORT}`);
  } else {
    console.error("Port number returned as undefined");
  }
});
