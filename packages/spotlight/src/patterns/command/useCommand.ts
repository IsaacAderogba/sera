import { useContext } from "react";
import {
  CommandItemContext,
  CommandLayoutContext,
  CommandQueryContext,
  CommandSectionContext,
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

export const useCommandItem = () => {
  return useContext(CommandItemContext);
};

export const useCommandSection = () => {
  return useContext(CommandSectionContext);
};

export const useCommandLayout = () => {
  return useContext(CommandLayoutContext);
};
