import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { ThemeMode, ThemePreference } from "../preload/types";
import { cache } from "../utilities/cache";
import { globalStyles, themeModes } from "../utilities/stitches";
import {
  ThemeContext,
  ThemePreferenceOptions,
  ThemeState
} from "./ThemeContext";

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

  const [state, setState] = useState<ThemeState>(() => {
    return {
      mode: setThemeMode(cache.get("theme-preference") || "dark")
    };
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
