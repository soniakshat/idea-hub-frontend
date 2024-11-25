// src/main.tsx

import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement as HTMLElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error(
    "Root element not found. Please ensure there is an element with id 'root' in your HTML."
  );
}
