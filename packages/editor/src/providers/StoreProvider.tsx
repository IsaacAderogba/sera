import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { store } from "./StoreContext";

export const StoreProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
