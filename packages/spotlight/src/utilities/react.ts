import React, { Context, useContext } from "react";

export const createContextHook = <T>(name: string, ctx: Context<T>) => {
  return () => {
    const context = useContext(ctx);
    if (!context) {
      throw new Error(`useContext must be used within a ${name} Provider`);
    }
    return context;
  };
};

export const extractReactNodeText = (node: React.ReactNode) => {
  let text = "";

  React.Children.forEach(node, child => {
    if (React.isValidElement(child)) {
      text += extractReactNodeText(child);
    } else if (typeof child === "string") {
      text += child;
    }
  });

  return text;
};
