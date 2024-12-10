import { useMemo } from "react";
import { Song } from "../../preload/ipc";
import {
  usePlaylistSongContext,
  useSongContext
} from "../../providers/DataContext";

export const usePlaylistSongs = (playlistId: number): Song[] => {
  const { state: songState } = useSongContext();
  const { state: playlistSongState } = usePlaylistSongContext();

  return useMemo(() => {
    const songs: Song[] = [];

    for (const id in playlistSongState) {
      const playlistSong = playlistSongState[id];
      if (playlistSong.playlistId === playlistId) {
        const song = songState[playlistSong.songId];
        if (!song) continue;

        songs.push(song);
      }
    }

    return songs;
  }, [playlistId, songState, playlistSongState]);
};
