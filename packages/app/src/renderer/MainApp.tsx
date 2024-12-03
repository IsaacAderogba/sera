import { AppProvider } from "../providers/AppProvider";
import { DataProvider } from "../providers/DataProvider";
import { MainRouterProvider } from "../providers/RouterProvider";
import { ThemeProvider } from "../providers/ThemeProvider";

export const MainApp: React.FC = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <DataProvider>
          <MainRouterProvider />
        </DataProvider>
      </AppProvider>
    </ThemeProvider>
  );
};
