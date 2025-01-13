import {
  InterfaceThemeMode,
  InterfaceThemePreference
} from "../../electron/preload/store";
import { darkTheme, lightTheme } from "./stitches";

export const themeClassNames = {
  light: lightTheme.className,
  dark: darkTheme.className
};

export const getThemeMode = (
  preference: InterfaceThemePreference
): InterfaceThemeMode => {
  const systemMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  return preference === "system" ? systemMode : preference;
};

export const setThemeMode = (
  preference: InterfaceThemePreference
): InterfaceThemeMode => {
  const nextMode = getThemeMode(preference);
  const prevMode = nextMode === "dark" ? "light" : "dark";

  document.documentElement.classList.remove(themeClassNames[prevMode]);
  document.documentElement.classList.remove(prevMode);

  document.documentElement.classList.add(themeClassNames[nextMode]);
  document.documentElement.classList.add(nextMode);

  document.documentElement.setAttribute("data-theme", nextMode);
  return nextMode;
};
