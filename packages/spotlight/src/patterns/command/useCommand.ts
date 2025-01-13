import { useContext } from "react";
import {
  CommandItemIdContext,
  CommandLayoutIdContext,
  CommandQueryContext,
  CommandSectionIdContext,
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
