import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { ThemePreference } from "../preload/ipc";
import { cache } from "../utilities/cache";
import { globalStyles, themeModes } from "../utilities/stitches";

const getThemeMode = (preference: ThemePreference): ThemeMode => {
  const systemMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  return preference === "system" ? systemMode : preference;
};

const setThemeMode = (preference: ThemePreference): ThemeMode => {
  const mode = getThemeMode(preference);
  const prevMode = mode === "dark" ? "light" : "dark";

  document.documentElement.classList.remove(themeModes[prevMode]);
  document.documentElement.classList.remove(prevMode);

  document.documentElement.classList.add(themeModes[mode]);
  document.documentElement.classList.add(mode);
  document.documentElement.setAttribute("data-theme", mode);
  return mode;
};

let injectedGlobalStyles = false;
export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  if (!injectedGlobalStyles) {
    globalStyles();
    injectedGlobalStyles = true;
  }

  const [state, setState] = useState<ThemeState>({
    mode: getThemeMode(cache.get("theme-preference") || "dark")
  });

  const setThemePreference = useCallback(
    (preference: ThemePreference, options: ThemePreferenceOptions) => {
      if (options.persist) {
        cache.set("theme-preference", preference);
        window.ipc.publish("themePreferenceChange", preference);
      }

      setState(state => ({ ...state, mode: setThemeMode(preference) }));
    },
    []
  );

  useEffect(() => {
    return window.ipc.subscribe("themePreferenceChange", (_ctx, preference) => {
      setState(state => ({ ...state, mode: setThemeMode(preference) }));
    });
  }, []);

  const value = useMemo(
    () => ({ state, setThemePreference }),
    [state, setThemePreference]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const ThemeContext = createContext<ThemeStore | undefined>(undefined);
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeContext");
  }
  return context;
};

export interface ThemeStore {
  state: ThemeState;
  setThemePreference: (
    preference: ThemePreference,
    options: ThemePreferenceOptions
  ) => void;
}

export interface ThemeState {
  mode: ThemeMode;
}

export type ThemeMode = "dark" | "light";
export type ThemePreferenceOptions = { persist: boolean };
