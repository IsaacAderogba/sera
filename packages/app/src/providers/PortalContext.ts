import { createContext, useContext } from "react";

export const PortalContext = createContext<PortalStore | undefined>(undefined);
export const usePortal = () => useContext(PortalContext);

export interface PortalStore {
  depth: number;
}
