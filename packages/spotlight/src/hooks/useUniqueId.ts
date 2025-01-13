import { useRef } from "react";
import { v4 } from "uuid";

export const useUniqueId = (id = v4()) => {
  const ref = useRef(id);
  return ref.current;
};
