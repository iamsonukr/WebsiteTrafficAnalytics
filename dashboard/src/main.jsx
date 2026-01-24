import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import AuthContextProvider from "./context/AuthContext.jsx";
import PosterProvider from "./context/PosterContext.jsx";
import { AppWrapper } from "./components/common/PageMeta.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <AuthContextProvider>
          <PosterProvider>
          <App />
          </PosterProvider>
        </AuthContextProvider>
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>,
);
