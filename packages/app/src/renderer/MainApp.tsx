import { AppProvider } from "../providers/AppProvider";
import { AudioProvider } from "../providers/AudioProvider";
import { DataProvider } from "../providers/DataProvider";
import { MainRouterProvider } from "../providers/RouterProvider";
import { ThemeProvider } from "../providers/ThemeProvider";

export const MainApp: React.FC = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <DataProvider>
          <AudioProvider>
            <MainRouterProvider />
          </AudioProvider>
        </DataProvider>
      </AppProvider>
    </ThemeProvider>
  );
};
