import {
  PropsWithChildren,
  Reducer,
  useEffect,
  useMemo,
  useReducer,
  useRef
} from "react";
import { AppAction, AppContext, AppState } from "./AppContext";
import { Item } from "../preload/types";

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, getAppState());
  useEffect(() => {
    localStorage.setItem("app-state", JSON.stringify(state));
  }, [state]);

  const audioRef = useRef(new Audio());
  const audioItem = useMemo(() => state.items[state.index], [state]);
  useEffect(() => {
    if (!audioItem?.id) return;

    switch (state.audio.type) {
      case "play": {
        const audioFileName = `audio://${audioItem.audioFilename}`;
        if (audioRef.current.src === audioFileName) {
          audioRef.current.play();
          audioRef.current.currentTime = 0;
          dispatch({ type: "audio", payload: { type: "playing" } });
        } else if (audioItem.audioFilename) {
          audioRef.current.src = audioFileName;
          audioRef.current.loop = true;
          audioRef.current.play();
          dispatch({ type: "audio", payload: { type: "playing" } });
        } else {
          dispatch({ type: "audio", payload: { type: "pause" } });
        }
        return;
      }
      case "playing": {
        const timeout = setTimeout(() => {
          dispatch({
            type: "audio",
            payload: {
              type: "playing",
              time: Math.ceil(audioRef.current.currentTime)
            }
          });
        }, 1000);
        return () => {
          clearTimeout(timeout);
        };
      }
      case "pause":
        audioRef.current.pause();
        return;
    }
  }, [state.audio.type, dispatch, audioItem?.id, audioItem?.audioFilename]);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const getAppState = (): AppState => {
  const state = localStorage.getItem("app-state");
  if (state) return JSON.parse(state) as AppState;

  return {
    index: 0,
    audio: { type: "pause", time: 0 },
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
      if (state.items.length <= 1) return state;
      const items = state.items.filter(item => item.id !== action.payload.id);
      const index = state.index;

      return {
        ...state,
        audio: { type: "pause", time: 0 },
        items,
        index: items[index] ? index : items[index - 1] ? index - 1 : 0
      };
    }
    case "navigate-up": {
      const index = state.index > 0 ? state.index - 1 : state.index;
      return {
        ...state,
        audio: { type: "pause", time: 0 },
        index: state.items[index] ? index : 0
      };
    }
    case "navigate-down": {
      const index =
        state.index < state.items.length - 1 ? state.index + 1 : state.index;
      return {
        ...state,
        audio: { type: "pause", time: 0 },
        index: state.items[index] ? index : 0
      };
    }
    case "audio":
      return { ...state, audio: { ...state.audio, ...action.payload } };
    default:
      return state;
  }
};

const generateId = () => Math.random().toString(16).slice(2);
