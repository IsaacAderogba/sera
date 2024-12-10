import { useEffect } from "react";
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

  useEffect(() => {
    if (!props.enabled) return;

    const onKeydown: KeyboardEventHandler = event => {
      if (event.key === "ArrowUp") {
        onValueChange(value => {
          const index = values.current.indexOf(value);
          return (
            values.current[index - 1] ||
            values.current[index] ||
            values.current[0]
          );
        });
      } else if (event.key === "ArrowDown") {
        onValueChange(value => {
          const index = values.current.indexOf(value);
          return (
            values.current[index + 1] ||
            values.current[index] ||
            values.current[0]
          );
        });
      }
    };

    document.addEventListener("keydown", onKeydown);
    return () => {
      document.removeEventListener("keydown", onKeydown);
    };
  }, [props.enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  return { value, onValueChange };
};

type KeyboardEventHandler = (e: KeyboardEvent | React.KeyboardEvent) => void;
