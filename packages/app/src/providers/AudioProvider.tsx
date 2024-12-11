import {
  Dispatch,
  PropsWithChildren,
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer
} from "react";
import { AudioContext, AudioState } from "./AudioContext";
import { AudioAction } from "../preload/types";
import { cache } from "../utilities/cache";

export const AudioProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, _dispatch] = useReducer(audioReducer, getAudioState());

  const dispatch: Dispatch<AudioAction> = useCallback(action => {
    cache.set("audio-action", action);
    window.ipc.publish("audioAction", action);

    _dispatch(action);
  }, []);

  useEffect(() => {
    return window.ipc.subscribe("audioAction", (_ctx, action) => {
      _dispatch(action);
    });
  }, []);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};

const getAudioState = (): AudioState => {
  return (
    cache.get("audio-action") || {
      type: "pause",
      playlistId: 0,
      songId: 0,
      time: 0
    }
  );
};

const audioReducer: Reducer<AudioState, AudioAction> = (state, action) => {
  switch (action.type) {
    case "play":
    case "playing":
    case "pause":
      return { ...state, ...action };
    default:
      throw new Error("Unknown action type");
  }
};
