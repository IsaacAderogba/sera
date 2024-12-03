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

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const Context = createContext<AppStore | undefined>(undefined);
export const useAppStore = () => {
  const context = useContext(Context);
  if (!context)
    throw new Error("useAppStore must be used within a AppProvider");
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

interface AppStore {
  state: AppState;
  setState: Dispatch<SetStateAction<AppState>>;
}

interface AppState {
  dataStatus: Record<Item["type"], Status>;
}

type Status = "loading" | "loaded";
