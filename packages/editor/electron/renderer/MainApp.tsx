import React from "react";
import { ThemeProvider } from "../../src/providers/ThemeProvider";
import App from "../../src/App";
import { StoreProvider } from "../../src/providers/StoreProvider";

export const MainApp: React.FC = () => {
  return (
    <StoreProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StoreProvider>
  );
};
