import { useCallback, useMemo } from "react";
import { Flex } from "../../components/Flex";
import { useCommandQuery, useCommandState } from "./useCommand";
import {
  CommandItem,
  CommandLayout,
  CommandMatch,
  CommandState
} from "./CommandStore";
import { throttle } from "lodash-es";
import commandScore from "command-score";
import { extractReactNodeText } from "../../utilities/react";

export interface CommandResultsProps {}
export const CommandResults: React.FC<CommandResultsProps> = () => {
  const query = useCommandQuery();
  const state = useCommandState();

  useResults();

  return <Flex></Flex>;
};

const useResults = () => {
  const state = useCommandState();

  const search = useCallback(throttledSearch, []);
};

const throttledSearch = throttle((state: CommandState) => {
  const items: CommandItem[] = [];

  for (const id in state.items) {
    const item = state.items[id];
    if (item.data.current.parentId !== state.rootId) continue;
    items.push(item);
  }

  const matches: CommandMatch[] = [];
  if (state.input.trim() === "") {
    matches.push(...items.map(item => ({ score: 0, item })));
  } else {
    for (const item of items) {
      const score = commandScore(
        extractReactNodeText(item.data.current.title),
        state.input
      );
      if (score > 0) matches.push({ score, item });
    }
  }

  const layout = state.layouts[items[0]?.data.current.layoutId];
}, 100);
