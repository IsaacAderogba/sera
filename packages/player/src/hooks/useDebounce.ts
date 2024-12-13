import { useRef, useEffect, DependencyList } from "react";
import { useCallbackRef } from "./useManagedRefs";

export function useDebounceCallback<T extends (...args: any[]) => void>(
  func: T,
  deps: DependencyList,
  delay = 500
) {
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
    };
  }, deps);

  const debouncedFunction = useCallbackRef((...args) => {
    const newTimer = setTimeout(() => {
      func(...args);
    }, delay);

    clearTimeout(timer.current);
    timer.current = newTimer;
  });

  return debouncedFunction as T;
}
