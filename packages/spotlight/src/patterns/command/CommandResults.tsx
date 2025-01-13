/* eslint-disable react-hooks/exhaustive-deps */
import { useVirtualizer } from "@tanstack/react-virtual";
import { useValueRef } from "../../hooks/useManagedRefs";
import {
  useCommandQuery,
  useCommandResults,
  useCommandState
} from "./useCommand";
import { useEffect, useRef } from "react";
import { Box } from "../../components/Box";

export interface CommandResultsProps {}
export const CommandResults: React.FC<CommandResultsProps> = () => {
  const query = useCommandQuery();
  const state = useCommandState();

  const { matches } = useCommandResults();

  const matchesRef = useValueRef(matches);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state.open || state.selected.open) return;

    const handler = (event: KeyboardEvent) => {
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;

      event.preventDefault();
      query.setState(state => {
        const matches = matchesRef.current;
        let index = state.selected.index;

        if (event.key === "ArrowUp") {
          index = index > 0 ? index - 1 : index;
          if (matches[index]?.type === "section") index -= 1;
        } else {
          index = index < matches.length - 1 ? index + 1 : index;
          if (matches[index]?.type === "section") index += 1;
        }

        return {
          ...state,
          selected: { open: false, index, id: matches[index]?.id }
        };
      });
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state.open, state.selected.open]);

  // reset if can't find a matching item
  useEffect(() => {
    if (!matches.length) return;
    if (matches.find(match => match.id === state.selected.id)) return;

    query.setState(state => ({
      ...state,
      selected: { open: false, index: 1, id: matches[1]?.id }
    }));
  }, [state.selected.id, matches]);

  // reset on input or rootId change
  useEffect(() => {
    query.setState(state => ({
      ...state,
      selected: { open: false, index: 1, id: matches[1]?.id }
    }));
  }, [state.rootId, state.input]);

  const rowVirtualizer = useVirtualizer({
    count: matches.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 10
  });
  const items = rowVirtualizer.getVirtualItems();

  return (
    <Box ref={parentRef} css={{ overflowY: "auto", flex: 3, padding: "$xs 0" }}>
      <Box
        role="listbox"
        style={{
          border: "1px solid red",
          height: `${rowVirtualizer.getTotalSize()}px`,
          transitionProperty: "height",
          transition: "100ms ease",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {items.map(({ key, index }) => {
          const match = matches[index];
          if (!match) return null;

          return match.type === "item" ? (
            <div
              key={key}
              role="option"
              data-index={index}
              onClick={() => {
                query.setState(state => ({
                  ...state,
                  selected: { open: false, index, id: match.id }
                }));
              }}
            >
              item
            </div>
          ) : (
            <div key={key} role="option" data-index={index}>
              section
            </div>
          );
        })}
      </Box>
    </Box>
  );
};
