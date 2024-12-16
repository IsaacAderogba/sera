import { PropsWithChildren, useMemo, useState } from "react";
import { AppContext, AppState } from "./AppContext";

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<AppState>({ index: 0, items: [] });

  const value = useMemo(() => ({ state, setState }), [state, setState]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
