import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/fonts.css";
import "./styles/design-tokens.css";
import "./styles/global.css";
import "./styles/typography.css";
import "./styles/hero.css";
import "./styles/menu.css";
import "./styles/campaign.css";
import App from "./App";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
