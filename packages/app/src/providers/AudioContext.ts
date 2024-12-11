import { createContext, Dispatch, SetStateAction } from "react";
import { createContextHook } from "../utilities/react";

export const AudioContext = createContext<AudioStore | undefined>(undefined);
export const useAudioContext = createContextHook(AudioContext);

export interface AudioState {}

export interface AudioStore {
  state: AudioState;
  setState: Dispatch<SetStateAction<AudioState>>;
}

export type AudioPreferenceOptions = { persist: boolean };
