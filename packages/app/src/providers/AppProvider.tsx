import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
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
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppContext");
  }
  return context;
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

export interface AppStore {
  state: AppState;
  setState: Dispatch<SetStateAction<AppState>>;
}

export interface AppState {
  dataStatus: Record<Item["type"], Status>;
}

type Status = "loading" | "loaded";
