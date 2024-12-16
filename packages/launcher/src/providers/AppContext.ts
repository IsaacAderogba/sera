import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { Item } from "../preload/types";

export const AppContext = createContext<AppStore | undefined>(undefined);
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useContext must be used within a AppContext");
  }
  return context;
};

export interface AppState {
  index: number;
  items: Item[];
}

export interface AppStore {
  state: AppState;
  setState: Dispatch<SetStateAction<AppState>>;
}
