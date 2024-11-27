import React from "react";
import ReactDom from "react-dom/client";
import App from "./App";
import { SessionProvider } from "./context/SessionContext";

const root = ReactDom.createRoot(document.getElementById("root"));

root.render(
  <SessionProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </SessionProvider>
);
