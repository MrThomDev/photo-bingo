import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

//This app has two contexts. One is for all the requests to the server to interact with the API (APIProvider). The other allows us to interact with a card object that is available in the global scope. This allows for updates/changes to the card to happen across the site more eaily.
import { APIProvider } from "./contexts/api.context";
import { CardProvider } from "./contexts/card.context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <APIProvider>
        <CardProvider>
          <App />
        </CardProvider>
      </APIProvider>
    </BrowserRouter>
  </React.StrictMode>
);
