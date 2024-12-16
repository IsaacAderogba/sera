import { createContext, useContext } from "react";
import { ThemeMode, ThemePreference } from "../preload/types";

export const ThemeContext = createContext<ThemeStore | undefined>(undefined);
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useContext must be used within a ThemeContext");
  }
  return context;
};

export interface ThemeState {
  mode: ThemeMode;
}

export interface ThemeStore {
  state: ThemeState;
  setThemePreference: (preference: ThemePreference) => void;
}
