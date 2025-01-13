import { createContext, MutableRefObject } from "react";
import { Size } from "../../utilities/stitches";

export const CommandItemIdContext = createContext("");
export const CommandSectionIdContext = createContext("");
export const CommandLayoutIdContext = createContext("");

export const CommandStateContext = createContext<CommandState | undefined>(
  undefined
);

export const CommandQueryContext = createContext<CommandQuery | undefined>(
  undefined
);

export interface CommandQuery {
  onRootIdChange: (state: React.SetStateAction<string>) => void;
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

export type CommandAction = {
  id: string;
  type: "action";
  data: MutableRefObject<CommandActionData>;
};

export type CommandActionData = {
  itemId: string;

  icon: React.ReactNode;
  title: React.ReactNode;
  shortcut: string;
};

export type CommandItem = {
  id: string;
  type: "item";
  data: MutableRefObject<CommandItemData>;
};

export type CommandItemData = {
  itemId: string;
  sectionId: string;
  layoutId: string;

  icon: React.ReactNode;
  title: React.ReactNode;
};

export type CommandSection = {
  id: string;
  type: "section";
  data: MutableRefObject<CommandSectionData>;
};
export type CommandSectionData = {
  title: React.ReactNode;
};

export type CommandLayout = {
  id: string;
  type: "layout";
  data: MutableRefObject<CommandLayoutData>;
};

export type CommandLayoutData = CommandListData;
export type CommandListData = {
  type: "list";
};
