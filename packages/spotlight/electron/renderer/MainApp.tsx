import React from "react";
import { StoreProvider } from "../../src/patterns/providers/StoreProvider";
import { MainView } from "../../src/views/MainView";

export const MainApp: React.FC = () => {
  return (
    <StoreProvider>
      <MainView />
    </StoreProvider>
  );
};
