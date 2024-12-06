import {
  FocusEventHandler,
  MouseEventHandler,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef
} from "react";
import { useCallbackRef } from "./useManagedRefs";

type MouseAction = { type: "mouse"; event: MouseEvent };
type KeyboardAction = { type: "keyboard"; event: KeyboardEvent };
type FocusAction = { type: "focus"; event: FocusEvent };

export interface DismissableProps {
  enabled: boolean;
  onDismiss: (action: KeyboardAction | MouseAction | FocusAction) => void;
}

export const useDismissable = <T extends HTMLElement>(
  ref: MutableRefObject<T | null>,
  props: DismissableProps
) => {
  const onDismiss: DismissableProps["onDismiss"] = useCallbackRef(action => {
    if (!props.enabled) return;
    props.onDismiss(action);
  });

  const mouseListeners = useMouseListeners(ref, onDismiss);
  const focusListeners = useFocusListeners(ref, onDismiss);
  useKeyboardListeners(onDismiss);

  return { ...mouseListeners, ...focusListeners };
};

function useMouseListeners<T extends HTMLElement>(
  ref: MutableRefObject<T | null>,
  onDismiss: (action: MouseAction) => void
) {
  const isClickInsideReactTree = useRef(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        event.target &&
        !isClickInsideReactTree.current &&
        !ref.current?.contains(event.target as Node)
      ) {
        onDismiss({ event, type: "mouse" });
      }

      isClickInsideReactTree.current = false;
    };

    const timerId = window.setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      window.clearTimeout(timerId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref.current]);

  const onClickCapture: MouseEventHandler = useCallback(() => {
    isClickInsideReactTree.current = true;
  }, []);

  return { onClickCapture };
}

function useFocusListeners<T extends HTMLElement>(
  ref: MutableRefObject<T | null>,
  onDismiss: (action: FocusAction) => void
) {
  const isFocusInsideReactTree = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    const handleFocusIn = (event: FocusEvent) => {
      if (
        event.target &&
        !isFocusInsideReactTree.current &&
        !ref.current?.contains(event.target as Node)
      ) {
        onDismiss({ event, type: "focus" });
      }

      isFocusInsideReactTree.current = false;
    };

    document.addEventListener("focusin", handleFocusIn);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, [ref.current]);

  const onFocusCapture: FocusEventHandler = useCallback(() => {
    isFocusInsideReactTree.current = true;
  }, []);

  return { onFocusCapture };
}

function useKeyboardListeners(onDismiss: (action: KeyboardAction) => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss({ event, type: "keyboard" });
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
}
