import { useMemo } from "react";
import { useSongContext } from "../../providers/DataContext";

export const useSong = (id: number) => {
  const { state } = useSongContext();
  return useMemo(() => state[id], [id, state]);
};
