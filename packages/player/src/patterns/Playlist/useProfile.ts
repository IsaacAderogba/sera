import { useMemo } from "react";
import { usePlaylistContext } from "../../providers/DataContext";

export const usePlaylist = (id: number) => {
  const { state } = usePlaylistContext();
  return useMemo(() => state[id], [id, state]);
};
