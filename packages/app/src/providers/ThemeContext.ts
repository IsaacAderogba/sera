import { createContext } from "react";
import { ThemeMode, ThemePreference } from "../preload/ipc";
import { createContextHook } from "../utilities/react";

export const ThemeContext = createContext<ThemeStore | undefined>(undefined);
export const useThemeContext = createContextHook(ThemeContext);

export interface ThemeState {
  mode: ThemeMode;
}

export interface ThemeStore {
  state: ThemeState;
  setThemePreference: (
    preference: ThemePreference,
    options: ThemePreferenceOptions
  ) => void;
}

export type ThemePreferenceOptions = { persist: boolean };
