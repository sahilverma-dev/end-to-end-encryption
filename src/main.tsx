import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { TopLoaderProvider } from "./context/TopLoaderContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <TopLoaderProvider>
          <App />
        </TopLoaderProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
