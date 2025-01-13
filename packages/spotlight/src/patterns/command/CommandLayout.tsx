import { PropsWithChildren, useEffect } from "react";
import { CommandLayoutIdContext, CommandLayoutData } from "./CommandStore";
import { useUniqueId } from "../../hooks/useUniqueId";
import { useCommandQuery } from "./useCommand";
import { useValueRef } from "../../hooks/useManagedRefs";

export type CommandLayoutProps = CommandLayoutData;
export const CommandLayout: React.FC<PropsWithChildren<CommandLayoutProps>> = ({
  children,
  ...props
}) => {
  const id = useUniqueId();
  const data = useValueRef(props);
  const query = useCommandQuery();

  useEffect(() => {
    const unregister = query.register({ id, type: "layout", data });
    return () => {
      unregister();
    };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <CommandLayoutIdContext.Provider value={id}>
      {children}
    </CommandLayoutIdContext.Provider>
  );
};
