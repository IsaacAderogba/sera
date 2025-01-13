import { useEffect } from "react";
import { useValueRef } from "../../hooks/useManagedRefs";
import { useUniqueId } from "../../hooks/useUniqueId";
import { CommandActionData } from "./CommandStore";
import { useCommandItemId, useCommandQuery } from "./useCommand";

export type CommandActionProps = Omit<CommandActionData, "itemId">;
export const CommandAction: React.FC<CommandActionProps> = props => {
  const id = useUniqueId();
  const itemId = useCommandItemId();
  const data = useValueRef<CommandActionData>({ ...props, itemId });

  const query = useCommandQuery();
  useEffect(() => {
    const unregister = query.register({ id, type: "action", data });
    return () => {
      unregister();
    };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};
