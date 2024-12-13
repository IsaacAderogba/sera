import { useCallback, useEffect } from "react";
import { useValueRef } from "./useManagedRefs";
import { useManagedState } from "./useManagedState";

interface KeyboardNavigationProps<T> {
  enabled: boolean;
  values: T[];
  defaultValue: T;
  value?: T;
  onValueChange?: (value: T) => void | Promise<void>;
}

export const useKeyboardNavigation = <T>(props: KeyboardNavigationProps<T>) => {
  const values = useValueRef(props.values);
  const [value, onValueChange] = useManagedState({
    defaultState: props.defaultValue,
    state: props.value,
    onStateChange: props.onValueChange
  });

  const previous = useCallback(() => {
    onValueChange(value => {
      const index = values.current.indexOf(value);
      return (
        values.current[index - 1] || values.current[index] || values.current[0]
      );
    });
  }, []);

  const next = useCallback(() => {
    onValueChange(value => {
      const index = values.current.indexOf(value);
      return (
        values.current[index + 1] || values.current[index] || values.current[0]
      );
    });
  }, []);

  useEffect(() => {
    if (!props.enabled) return;
    const onKeydown: KeyboardEventHandler = event => {
      if (event.key === "ArrowUp") {
        previous();
      } else if (event.key === "ArrowDown") {
        next();
      }
    };

    document.addEventListener("keydown", onKeydown);
    return () => {
      document.removeEventListener("keydown", onKeydown);
    };
  }, [props.enabled, next, previous]);

  return { value, next, previous, onValueChange };
};

type KeyboardEventHandler = (e: KeyboardEvent | React.KeyboardEvent) => void;
