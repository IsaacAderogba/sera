import { AppProvider } from "../providers/AppProvider";
import { DataProvider } from "../providers/DataProvider";
import { MenubarRouterProvider } from "../providers/RouterProvider";
import { ThemeProvider } from "../providers/ThemeProvider";

export const MenubarApp: React.FC = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <DataProvider>
          <MenubarRouterProvider />
        </DataProvider>
      </AppProvider>
    </ThemeProvider>
  );
};
