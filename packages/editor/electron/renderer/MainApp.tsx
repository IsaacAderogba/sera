import React from "react";
import { ThemeProvider } from "../../src/providers/ThemeProvider";
import App from "../../src/App";

export const MainApp: React.FC = () => {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
};
