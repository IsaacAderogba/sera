import React from "react";
import { StoreProvider } from "../../src/providers/StoreProvider";
import { ThemeProvider } from "../../src/providers/ThemeProvider";
import { EditorView } from "../../src/views/EditorView";

export const MainApp: React.FC = () => {
  return (
    <StoreProvider>
      <ThemeProvider>
        <EditorView />
      </ThemeProvider>
    </StoreProvider>
  );
};
