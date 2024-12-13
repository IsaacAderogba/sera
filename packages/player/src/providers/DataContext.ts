import { createContext, Dispatch, SetStateAction } from "react";
import { Item, Playlist, PlaylistSong, Profile, Song } from "../preload/types";
import { createContextHook } from "../utilities/react";

export const ProfileContext = createContext<DataStore<Profile> | undefined>(
  undefined
);
export const useProfileContext = createContextHook(ProfileContext);

export const PlaylistContext = createContext<DataStore<Playlist> | undefined>(
  undefined
);
export const usePlaylistContext = createContextHook(PlaylistContext);

export const SongContext = createContext<DataStore<Song> | undefined>(
  undefined
);
export const useSongContext = createContextHook(SongContext);

export const PlaylistSongContext = createContext<
  DataStore<PlaylistSong> | undefined
>(undefined);
export const usePlaylistSongContext = createContextHook(PlaylistSongContext);

interface DataStore<T extends Item> {
  state: Record<string, T>;
  setState: Dispatch<SetStateAction<Record<string, T>>>;
}
