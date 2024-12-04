import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useState
} from "react";
import { Item } from "../preload/ipc";

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<AppState>(createDefaultState());
  const value = useMemo(() => ({ state, setState }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppContext = createContext<AppStore | undefined>(undefined);

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

export interface AppStore {
  state: AppState;
  setState: Dispatch<SetStateAction<AppState>>;
}

export interface AppState {
  dataStatus: Record<Item["type"], Status>;
}

type Status = "loading" | "loaded";
