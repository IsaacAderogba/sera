import { createContext, Dispatch } from "react";
import { AudioAction } from "../preload/types";
import { createContextHook } from "../utilities/react";

export const AudioContext = createContext<AudioStore | undefined>(undefined);
export const useAudioContext = createContextHook(AudioContext);

export type AudioState = {
  type: "play" | "playing" | "pause";
  playlistId: number;
  songId: number;
  time: number;
};

export interface AudioStore {
  state: AudioState;
  dispatch: Dispatch<AudioAction>;
}

export type AudioPreferenceOptions = { persist: boolean };
