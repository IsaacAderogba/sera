import { Fragment, PropsWithChildren } from "react";

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};
