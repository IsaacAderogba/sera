import { AppProvider } from "../providers/AppProvider";
import { AudioProvider } from "../providers/AudioProvider";
import { DataProvider } from "../providers/DataProvider";
import { MenubarRouterProvider } from "../providers/RouterProvider";
import { ThemeProvider } from "../providers/ThemeProvider";

export const MenubarApp: React.FC = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <DataProvider>
          <AudioProvider>
            <MenubarRouterProvider />
          </AudioProvider>
        </DataProvider>
      </AppProvider>
    </ThemeProvider>
  );
};
