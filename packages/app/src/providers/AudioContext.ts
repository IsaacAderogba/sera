import { createContext, Dispatch } from "react";
import { AudioAction } from "../preload/types";
import { createContextHook } from "../utilities/react";

export const AudioContext = createContext<AudioStore | undefined>(undefined);
export const useAudioContext = createContextHook(AudioContext);

export type AudioState = AudioAction;

export interface AudioStore {
  state: AudioState;
  dispatch: Dispatch<AudioAction>;
}

export type AudioPreferenceOptions = { persist: boolean };
