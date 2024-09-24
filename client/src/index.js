import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

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
