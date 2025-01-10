import { View, WebContentsView } from "electron";

export const isWebContentsView = (
  view: WebContentsView | View
): view is WebContentsView => {
  return view instanceof WebContentsView;
};
