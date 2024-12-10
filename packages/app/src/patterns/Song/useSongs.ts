import { useMemo } from "react";
import { useSongContext } from "../../providers/DataContext";
import { Song } from "../../preload/ipc";

export const useSongs = (profileId: number) => {
  const { state } = useSongContext();
  return useMemo(() => {
    const songs: Song[] = [];

    for (const id in state) {
      if (state[id].profileId === profileId) {
        songs.push(state[id]);
      }
    }

    return songs;
  }, [profileId, state]);
};
