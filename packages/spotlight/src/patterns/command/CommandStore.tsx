import { createContext, MutableRefObject } from "react";
import { Size } from "../../utilities/stitches";

export const CommandItemContext = createContext("");
export const CommandSectionContext = createContext("");
export const CommandLayoutContext = createContext("");

export const CommandStateContext = createContext<CommandState | undefined>(
  undefined
);

export const CommandQueryContext = createContext<CommandState | undefined>(
  undefined
);

export interface CommandQuery {
  onRootIdChange: (state: React.SetStateAction<string | undefined>) => void;
  onInputChange: (state: React.SetStateAction<string>) => void;
  onOpenChange: (state: React.SetStateAction<boolean>) => void;

  register: (
    data: CommandItem | CommandSection | CommandLayout | CommandAction
  ) => () => void;
}

export interface CommandState {
  rootId: string;
  input: string;
  open: boolean;

  actions: Record<string, CommandAction>;
  items: Record<string, CommandItem>;
  sections: Record<string, CommandSection>;
  layouts: Record<string, CommandLayout>;

  size: Size;
}

type CommandAction = {
  id: string;
  type: "action";
  data: MutableRefObject<CommandActionData>;
};

type CommandActionData = {
  itemId: string;

  icon: React.ReactNode;
  title: React.ReactNode;
  shortcut: string;
};

type CommandItem = {
  id: string;
  type: "item";
  data: MutableRefObject<CommandItemData>;
};

type CommandItemData = {
  itemId: string;
  layoutId: string;
  sectionId: string;

  icon: React.ReactNode;
  title: React.ReactNode;
};

type CommandSection = {
  id: string;
  type: "section";
  data: MutableRefObject<CommandSectionData>;
};
type CommandSectionData = {
  title: React.ReactNode;
};

type CommandLayout = {
  id: string;
  type: "layout";
  data: MutableRefObject<CommandLayoutData>;
};

type CommandLayoutData = CommandListData;
type CommandListData = {
  type: "list";
};
