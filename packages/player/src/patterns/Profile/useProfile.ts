import { useMemo } from "react";
import { useProfileContext } from "../../providers/DataContext";

export const useProfile = (id: number) => {
  const { state } = useProfileContext();
  return useMemo(() => state[id], [id, state]);
};
