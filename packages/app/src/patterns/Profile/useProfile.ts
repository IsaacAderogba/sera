import { useMemo } from "react";
import { useProfileContext } from "../../providers/DataContext";
import { Id } from "../../preload/ipc";

export const useProfile = (id: Id) => {
  const { state } = useProfileContext();
  return useMemo(() => state[id], [id, state]);
};
