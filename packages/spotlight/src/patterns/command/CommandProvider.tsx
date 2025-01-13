import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useManagedState } from "../../hooks/useManagedState";
import { Size } from "../../utilities/stitches";
import {
  CommandQuery,
  CommandQueryContext,
  CommandState,
  CommandStateContext
} from "./CommandStore";

export interface CommandProviderProps {
  size?: Size;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  input?: string;
  onInputChange?: (input: string) => void;
  rootId?: string;
  onRootIdChange?: (id: string | undefined) => void;
}

export const CommandProvider: React.FC<
  PropsWithChildren<CommandProviderProps>
> = ({
  children,
  size = "default",
  open: openProp,
  onOpenChange: onOpenChangeProp,
  input: inputProp,
  onInputChange: onInputChangeProp,
  rootId: rootIdProp,
  onRootIdChange: onRootIdChangeProp
}) => {
  const [open, onOpenChange] = useManagedState({
    defaultState: true,
    state: openProp,
    onStateChange: onOpenChangeProp
  });

  const [input, onInputChange] = useManagedState({
    defaultState: "",
    state: inputProp,
    onStateChange: onInputChangeProp
  });

  const [rootId, onRootIdChange] = useManagedState({
    defaultState: "",
    state: rootIdProp,
    onStateChange: onRootIdChangeProp
  });

  const [state, setState] = useState<CommandState>({
    open,
    input,
    rootId,
    actions: {},
    items: {},
    layouts: {},
    sections: {},
    size,
    selected: { id: "", index: 0, open: false }
  });

  useEffect(() => {
    setState(state => ({ ...state, open, input, rootId }));
  }, [open, input, rootId]);

  const query: CommandQuery = useMemo(
    () => ({
      setState,
      onInputChange,
      onRootIdChange,
      onOpenChange,
      register: data => {
        const key = `${data.type}s`;
        setState(state => {
          return { ...state, [key]: { ...state[key], [data.id]: data } };
        });

        return () => {
          setState(state => {
            const record = { ...state[key] };
            delete record[data.id];
            return { ...state, [key]: record };
          });
        };
      }
    }),
    []
  );

  return (
    <CommandStateContext.Provider value={state}>
      <CommandQueryContext.Provider value={query}>
        {children}
      </CommandQueryContext.Provider>
    </CommandStateContext.Provider>
  );
};
