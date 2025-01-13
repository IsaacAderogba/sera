import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash-es";
import {
  InterfaceState,
  InterfaceThemePreference
} from "../../electron/preload/store";
import { DeepPartial } from "../../electron/preload/utilities";
import { cache } from "../utilities/cache";
import { setThemeMode } from "../utilities/theme";

interface ThemePreferenceProps {
  preference: InterfaceThemePreference;
  persist: boolean;
}

function getInitialState(): InterfaceState {
  return { themeMode: setThemeMode(cache.get("theme") || "light") };
}

export const interfaceStore = createSlice({
  name: "interface",
  initialState: getInitialState(),
  reducers: {
    setState: (state, action: PayloadAction<DeepPartial<InterfaceState>>) => {
      return merge({}, state, action.payload);
    },

    setThemePreference: (
      state,
      action: PayloadAction<ThemePreferenceProps>
    ) => {
      const { persist, preference } = action.payload;
      if (persist) {
        cache.set("theme", preference);
        window.ipc.publish("themeChange", preference);
      }

      state.themeMode = setThemeMode(preference);
    },

    resetState: () => {
      return getInitialState();
    }
  }
});
