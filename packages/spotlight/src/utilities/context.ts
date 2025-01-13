import { Context, useContext } from "react";

export const createContextHook = <T>(name: string, ctx: Context<T>) => {
  return () => {
    const context = useContext(ctx);
    if (!context) {
      throw new Error(`useContext must be used within a ${name} Provider`);
    }
    return context;
  };
};
