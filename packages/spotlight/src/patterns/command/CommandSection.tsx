import { PropsWithChildren, useEffect } from "react";
import { CommandSectionIdContext, CommandSectionData } from "./CommandStore";
import { useUniqueId } from "../../hooks/useUniqueId";
import { useCommandQuery } from "./useCommand";
import { useValueRef } from "../../hooks/useManagedRefs";

export type CommandSectionProps = CommandSectionData;
export const CommandSection: React.FC<
  PropsWithChildren<CommandSectionProps>
> = ({ children, ...props }) => {
  const id = useUniqueId();
  const data = useValueRef(props);
  const query = useCommandQuery();

  useEffect(() => {
    const unregister = query.register({ id, type: "section", data });
    return () => {
      unregister();
    };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <CommandSectionIdContext.Provider value={id}>
      {children}
    </CommandSectionIdContext.Provider>
  );
};
