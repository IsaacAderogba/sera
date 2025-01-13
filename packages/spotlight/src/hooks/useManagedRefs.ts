import { useEffect, useMemo, useRef } from "react";

export function useValueRef<T>(data: T) {
  const ref = useRef<T>(data);
  ref.current = data;

  return ref;
}

export function useCallbackRef<T extends (...args: any[]) => any>(
  callback: T | undefined
): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, []);
}
