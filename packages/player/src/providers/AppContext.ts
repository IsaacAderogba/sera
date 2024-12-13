import { createContext, Dispatch, SetStateAction } from "react";
import { Item } from "../preload/types";
import { createContextHook } from "../utilities/react";

export const AppContext = createContext<AppStore | undefined>(undefined);
export const useAppContext = createContextHook(AppContext);

export interface AppStore {
  state: AppState;
  setState: Dispatch<SetStateAction<AppState>>;
}

export interface AppState {
  dataStatus: Record<Item["type"], Status>;
}

type Status = "loading" | "loaded";
