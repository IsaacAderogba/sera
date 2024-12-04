import { Context, useContext } from "react";

export const createContextHook = <T>(ctx: Context<T>) => {
  return () => {
    const context = useContext(ctx);
    if (!context) {
      throw new Error("useContext must be used within a ContextProvider");
    }
    return context;
  };
};
