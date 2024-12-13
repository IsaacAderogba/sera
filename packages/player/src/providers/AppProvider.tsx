import { PropsWithChildren, useMemo, useState } from "react";
import { AppContext, AppState } from "./AppContext";

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<AppState>(createDefaultState());
  const value = useMemo(() => ({ state, setState }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const createDefaultState = (): AppState => {
  return {
    dataStatus: {
      profile: "loading",
      playlist: "loading",
      playlist_song: "loading",
      song: "loading"
    }
  };
};
