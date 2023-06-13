import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-image-gallery/styles/css/image-gallery.css";
import { ProSidebarProvider } from "react-pro-sidebar";
import "./index.css";

import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ProSidebarProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ProSidebarProvider>
  </React.StrictMode>
);
