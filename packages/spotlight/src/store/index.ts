import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useSelector as useReduxSelector
} from "react-redux";
import { createLogger } from "redux-logger";
import { InterfaceState } from "../../electron/preload/store";
import { interfaceStore } from "./interface";

export type StoreState = {
  interface: InterfaceState;
};

export const store = configureStore({
  reducer: combineReducers({ interface: interfaceStore.reducer }),
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware().prepend(createLogger({ collapsed: true }));
  }
});

export type Selector = TypedUseSelectorHook<StoreState>;
export const selector: Selector = selector => selector(store.getState());
export const useSelector: Selector = useReduxSelector;

export const dispatch = store.dispatch.bind(store);
export const actions = {};
