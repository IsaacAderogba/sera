import { PropsWithChildren, useEffect } from "react";
import { CommandItemIdContext, CommandItemData } from "./CommandStore";
import { useUniqueId } from "../../hooks/useUniqueId";
import {
  useCommandItemId,
  useCommandLayoutId,
  useCommandQuery,
  useCommandSectionId
} from "./useCommand";
import { useValueRef } from "../../hooks/useManagedRefs";

export type CommandItemProps = Omit<
  CommandItemData,
  "itemId" | "sectionId" | "layoutId"
>;
export const CommandItem: React.FC<PropsWithChildren<CommandItemProps>> = ({
  children,
  ...props
}) => {
  const id = useUniqueId();
  const parentId = useCommandItemId();
  const sectionId = useCommandSectionId();
  const layoutId = useCommandLayoutId();
  const data = useValueRef<CommandItemData>({
    ...props,
    parentId,
    sectionId,
    layoutId
  });

  const query = useCommandQuery();
  useEffect(() => {
    const unregister = query.register({ id, type: "item", data });
    return () => {
      unregister();
    };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <CommandItemIdContext.Provider value={id}>
      {children}
    </CommandItemIdContext.Provider>
  );
};
