import { ThemeProvider } from "auth/context/ThemeContext";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Modal from "react-modal";
import { AppWrapper } from "shared/components/panels/PageMeta.tsx";
import App from "./App.tsx";
import "./i18n/index.ts";
import "./index.css";

Modal.setAppElement("#root");
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrimeReactProvider value={{ ripple: true }}>
      <ThemeProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </ThemeProvider>
    </PrimeReactProvider>
  </StrictMode>,
);
