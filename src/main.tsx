
// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";

// 👇 This import is critical so Vite bundles your global styles
import "./styles/index.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
  // Helpful runtime message if #root is missing in index.html
  throw new Error("Root element #root not found in index.html");
}

createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
