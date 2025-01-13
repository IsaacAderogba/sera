import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { store } from "../../store";
import { globalStyles } from "../../utilities/stitches";

let injectedGlobalStyles = false;
export const StoreProvider: React.FC<PropsWithChildren> = ({ children }) => {
  if (!injectedGlobalStyles) {
    globalStyles();
    injectedGlobalStyles = true;
  }

  return <Provider store={store}>{children}</Provider>;
};
