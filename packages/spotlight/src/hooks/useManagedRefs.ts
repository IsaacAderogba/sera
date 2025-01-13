import { useRef } from "react";

export function useValueRef<T>(data: T) {
  const ref = useRef<T>(data);
  ref.current = data;

  return ref;
}
