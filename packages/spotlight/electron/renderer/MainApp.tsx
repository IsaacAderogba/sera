import React from "react";
import { StoreProvider } from "../../src/patterns/providers/StoreProvider";
import { MainRouterProvider } from "../../src/patterns/providers/RouterProvider";

const MainApp: React.FC = () => {
  return (
    <StoreProvider>
      <MainRouterProvider />
    </StoreProvider>
  );
};

export default MainApp;
