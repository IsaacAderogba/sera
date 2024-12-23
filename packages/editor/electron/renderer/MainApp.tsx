import React from "react";
import { StoreProvider } from "../../src/providers/StoreProvider";
import { ThemeProvider } from "../../src/providers/ThemeProvider";
import { EditorView } from "../../src/views/EditorView";
import { DropzoneProvider } from "../../src/providers/DropzoneProvider";

export const MainApp: React.FC = () => {
  return (
    <StoreProvider>
      <ThemeProvider>
        <DropzoneProvider>
          <EditorView />
        </DropzoneProvider>
      </ThemeProvider>
    </StoreProvider>
  );
};
