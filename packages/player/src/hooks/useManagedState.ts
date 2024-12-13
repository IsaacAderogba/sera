import { SetStateAction, useState } from "react";
import { useCallbackRef } from "./useManagedRefs";

export interface ManagedStateProps<T> {
  defaultState: T;
  state?: T;
  onStateChange?: (input: T) => void;
}

export const useManagedState = <T>({
  defaultState,
  onStateChange: onStateChangeProp,
  state: stateProp
}: ManagedStateProps<T>) => {
  const [uncontrolledState, setUncontrolledState] = useState(defaultState);
  const onStateChange = useCallbackRef(onStateChangeProp);

  const setState = useCallbackRef((state: SetStateAction<T>) => {
    if (stateProp !== undefined) {
      // state is being controlled externally
      onStateChange(getState(stateProp, state));
    } else {
      // state is being controlled internally.
      setUncontrolledState(prevState => {
        const newState = getState(prevState, state);
        onStateChange(newState);
        return newState;
      });
    }
  });

  const state = stateProp !== undefined ? stateProp : uncontrolledState;
  return [state, setState] as const;
};

const getState = <S>(prevState: S, state: SetStateAction<S>): S =>
  isSetStateFn<S>(state) ? state(prevState) : state;

function isSetStateFn<S>(fn: SetStateAction<S>): fn is SetStateFunction<S> {
  return typeof fn === "function";
}

type SetStateFunction<S> = (prevState: S) => S;
