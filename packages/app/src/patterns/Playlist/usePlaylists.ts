import { useMemo } from "react";
import { usePlaylistContext } from "../../providers/DataContext";
import { Id, Playlist } from "../../preload/ipc";

export const usePlaylists = (profileId: Id) => {
  const { state } = usePlaylistContext();
  return useMemo(() => {
    const playlists: Playlist[] = [];

    for (const id in state) {
      if (state[id].profileId === profileId) {
        playlists.push(state[id]);
      }
    }

    return playlists;
  }, [profileId, state]);
};
