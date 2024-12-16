import { createContext, Dispatch, useContext } from "react";
import { Item } from "../preload/types";

export const AppContext = createContext<AppStore | undefined>(undefined);
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useContext must be used within a AppContext");
  }
  return context;
};

export interface AppStore {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

export interface AppState {
  index: number;
  items: Item[];
}

export type AppAction =
  | CreateItemAction
  | UpdateItemAction
  | DeleteItemAction
  | NavigateUpAction
  | NavigateDownAction;
type CreateItemAction = {
  type: "create-item";
  payload: { item: Omit<Item, "id"> };
};
type UpdateItemAction = {
  type: "update-item";
  payload: { id: string; item: Partial<Item> };
};
type DeleteItemAction = { type: "delete-item"; payload: { id: string } };
type NavigateUpAction = { type: "navigate-up"; payload: never };
type NavigateDownAction = { type: "navigate-down"; payload: never };
