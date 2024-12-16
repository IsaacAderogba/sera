import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { ThemeMode, ThemePreference } from "../preload/types";
import { globalStyles, themeModes } from "../utilities/stitches";
import { ThemeContext, ThemeState } from "./ThemeContext";
import { Theme } from "@radix-ui/themes";

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
    const preference = window.localStorage.getItem(
      "theme-preference"
    ) as ThemeMode;

    return {
      mode: setThemeMode(preference || "dark")
    };
  });

  const setThemePreference = useCallback((preference: ThemePreference) => {
    window.localStorage.setItem("theme-preference", preference);
    window.ipc.invoke("setThemeSource", preference);

    console.log("change theme");

    setState(state => ({ ...state, mode: setThemeMode(preference) }));
  }, []);

  const value = useMemo(
    () => ({ state, setThemePreference }),
    [state, setThemePreference]
  );

  return (
    <ThemeContext.Provider value={value}>
      <Theme
        accentColor="gray"
        appearance={state.mode}
        style={{ height: "100%", background: "transparent" }}
      >
        {children}
      </Theme>
    </ThemeContext.Provider>
  );
};
