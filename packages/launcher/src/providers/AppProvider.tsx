import { PropsWithChildren, Reducer, useMemo, useReducer } from "react";
import { AppAction, AppContext, AppState } from "./AppContext";
import { Item } from "../preload/types";

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, getAppState());

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const getAppState = (): AppState => {
  return {
    index: 0,
    items: [
      { id: generateId(), prompt: "", audioDuration: 0, audioFilename: "" }
    ]
  };
};

const appReducer: Reducer<AppState, AppAction> = (state, action) => {
  switch (action.type) {
    case "create-item": {
      const items: Item[] = [
        ...state.items,
        { ...action.payload.item, id: generateId() }
      ];
      return { ...state, items, index: items.length - 1 };
    }
    case "update-item": {
      const items = state.items.map(item => {
        if (action.payload.id !== item.id) return item;
        return { ...item, ...action.payload.item };
      });
      return { ...state, items };
    }
    case "delete-item": {
      const items = state.items.filter(item => item.id !== action.payload.id);
      const index = state.index;

      return {
        ...state,
        items,
        index: items[index] ? index : items[index - 1] ? index - 1 : 0
      };
    }
    case "navigate-up": {
      const index = state.index > 0 ? state.index - 1 : state.index;
      return { ...state, index: state.items[index] ? index : 0 };
    }
    case "navigate-down": {
      const index =
        state.index < state.items.length - 1 ? state.index + 1 : state.index;
      return { ...state, index: state.items[index] ? index : 0 };
    }
    default:
      return state;
  }
};

const generateId = () => Math.random().toString(16).slice(2);
