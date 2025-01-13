import commandScore from "command-score";
import { throttle } from "lodash-es";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { extractReactNodeText } from "../../utilities/react";
import {
  CommandItem,
  CommandItemIdContext,
  CommandLayoutIdContext,
  CommandMatch,
  CommandQueryContext,
  CommandSection,
  CommandSectionIdContext,
  CommandState,
  CommandStateContext
} from "./CommandStore";

export const useCommandState = () => {
  const context = useContext(CommandStateContext);
  if (!context) {
    throw new Error(`useContext must be used within a CommandStateProvider`);
  }
  return context;
};

export const useCommandQuery = () => {
  const context = useContext(CommandQueryContext);
  if (!context) {
    throw new Error(`useContext must be used within a CommandQueryProvider`);
  }
  return context;
};

export const useCommandItemId = () => {
  return useContext(CommandItemIdContext);
};

export const useCommandSectionId = () => {
  return useContext(CommandSectionIdContext);
};

export const useCommandLayoutId = () => {
  return useContext(CommandLayoutIdContext);
};

type Match = Omit<CommandItem, "data"> | Omit<CommandSection, "data">;
export const useCommandResults = () => {
  const [state, setState] = useState<{ layoutId: string; matches: Match[] }>({
    layoutId: "",
    matches: []
  });

  const commandState = useCommandState();
  const search = useCallback(
    throttle(
      (state: CommandState) => {
        // 1. filter items by root id
        const items: CommandItem[] = [];
        for (const id in state.items) {
          const item = state.items[id];
          if (item.data.current.parentId !== state.rootId) continue;
          items.push(item);
        }

        // 2. create scored item matches
        const itemMatches: CommandMatch<CommandItem>[] = [];
        if (state.input.trim() === "") {
          itemMatches.push(...items.map(data => ({ score: 0, data })));
        } else {
          for (const item of items) {
            const score = commandScore(
              extractReactNodeText(item.data.current.title),
              state.input
            );
            if (score > 0) itemMatches.push({ score, data: item });
          }
        }

        // 3. create section matches
        const sectionMatches: Record<
          string,
          CommandMatch<{
            sectionId: string;
            items: CommandMatch<CommandItem>[];
          }>
        > = {};

        for (const itemMatch of itemMatches) {
          const { sectionId } = itemMatch.data.data.current;
          if (!sectionMatches[sectionId]) {
            sectionMatches[sectionId] = {
              score: 0,
              data: { sectionId, items: [] }
            };
          }

          sectionMatches[sectionId].score = Math.max(
            sectionMatches[sectionId].score,
            itemMatch.score
          );
          sectionMatches[sectionId].data.items.push(itemMatch);
        }

        // 4. sort section matches
        for (const id in sectionMatches) {
          const items = sectionMatches[id].data.items;
          sectionMatches[id].data.items = items.sort(orderByScore);
        }

        // 5. sort item matches
        const matches: Match[] = [];

        Object.values(sectionMatches)
          .sort(orderByScore)
          .forEach(({ data: { sectionId, items } }) => {
            if (!items.length) return;
            matches.push({ id: sectionId, type: "section" });
            items.forEach(i => matches.push({ id: i.data.id, type: "item" }));
          });

        setState({ layoutId: items[0]?.data.current.layoutId, matches });
      },
      100,
      { trailing: true }
    ),
    []
  );

  useEffect(() => search(commandState), [search, commandState]);

  return state;
};

function orderByScore<T>(a: CommandMatch<T>, b: CommandMatch<T>) {
  return b.score - a.score;
}
