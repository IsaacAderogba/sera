import { useEffect, useMemo, useState } from "react";
import { styled } from "../../utilities/stitches";
import { useCommandQuery, useCommandState } from "./useCommand";
import { extractReactNodeText } from "../../utilities/react";

export interface CommandInputProps {}

export const CommandInput: React.FC<CommandInputProps> = () => {
  const query = useCommandQuery();
  const state = useCommandState();

  const [input, onInputChange] = useState("");
  useEffect(() => () => onInputChange(""), [state.rootId]);
  useEffect(() => query.onInputChange(input), [input]);

  const placeholder = useMemo(() => {
    const node = state.items[state.rootId]?.data.current.title;
    return state.rootId && node ? extractReactNodeText(node) : "Search...";
  }, [state]);

  return (
    <Input
      placeholder={placeholder}
      value={input}
      onChange={event => onInputChange(event.target.value)}
      onKeyDown={event => {
        if (state.rootId && !input && event.key === "Backspace") {
          event.preventDefault();
          query.onRootIdChange(
            state.items[state.rootId]?.data?.current?.parentId || ""
          );
        }
      }}
    />
  );
};

const Input = styled("input", {
  width: "100%",
  border: "none",
  color: "$text",
  "&::placeholder": {
    color: "$disable"
  },
  variants: {
    size: {
      compact: { padding: "$sm", fontSize: "$xs" },
      default: { padding: "$base", fontSize: "$sm" }
    }
  },
  defaultVariants: { size: "default" }
});
