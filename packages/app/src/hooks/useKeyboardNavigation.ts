import { useEffect } from "react";
import { useValueRef } from "./useManagedRefs";
import { useManagedState } from "./useManagedState";

interface KeyboardNavigationProps {
  enabled: boolean;
  values: string[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void | Promise<void>;
}

export const useKeyboardNavigation = (props: KeyboardNavigationProps) => {
  const values = useValueRef(props.values);
  const [value, onValueChange] = useManagedState({
    defaultState: props.defaultValue || "",
    state: props.value,
    onStateChange: props.onValueChange
  });

  useEffect(() => {
    if (!props.enabled) return;

    const onKeydown: KeyboardEventHandler = event => {
      if (event.key === "ArrowUp") {
        onValueChange(value => {
          const index = values.current.indexOf(value);
          return values.current[index - 1] || values.current[index];
        });
      } else if (event.key === "ArrowDown") {
        onValueChange(value => {
          const index = values.current.indexOf(value);
          return values.current[index + 1] || values.current[index];
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
