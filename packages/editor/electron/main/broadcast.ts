import {
  BrowserWindow,
  IpcMainEvent,
  nativeTheme,
  View,
  WebContentsView
} from "electron";
import os from "os";
import { IPCBroadcastEvents, IPCContext, Platform } from "../preload/types";

export const onIPCBroadcast = <T extends keyof IPCBroadcastEvents>(
  event: IpcMainEvent,
  subject: T,
  ...data: Parameters<IPCBroadcastEvents[T]>
) => broadcast(event.sender.id, subject, ...data);

export const broadcast = async <T extends keyof IPCBroadcastEvents>(
  viewId: number,
  subject: T,
  ...data: Parameters<IPCBroadcastEvents[T]>
) => {
  const context = getWindowContext(viewId);
  console.log("[message]", subject);

  const windows = BrowserWindow.getAllWindows().filter(
    window => window.id !== context.windowId
  );

  for (const window of windows) {
    window.webContents.send(subject, context, ...data);

    for (const view of window.contentView.children) {
      if (!isWebContentsView(view)) continue;
      view.webContents.send(subject, context, ...data);
    }
  }

  // @ts-expect-error - A spread argument must either have a tuple type or be passed to a rest parameter
  await handlers[subject]?.(...data);
};

const handlers: Partial<IPCBroadcastEvents> = {
  themeChange: async themeSource => {
    nativeTheme.themeSource = themeSource;
  }
};

const getWindowContext = (viewId: number): IPCContext => {
  const windows = BrowserWindow.getAllWindows();

  const selectedWindow = windows.find(window => {
    const isOwnView = window.webContents.id === viewId;
    const isChildView = window.contentView.children.some(view => {
      return isWebContentsView(view) ? view.webContents.id === viewId : false;
    });

    return isOwnView || isChildView;
  });

  return {
    windowId: selectedWindow?.id || -1,
    viewId,
    platform: getPlatform()
  };
};

const isWebContentsView = (
  view: WebContentsView | View
): view is WebContentsView => {
  return view instanceof WebContentsView;
};

const getPlatform = (): Platform => {
  switch (os.platform()) {
    case "darwin":
      return "mac";
    case "win32":
      return "windows";
    default:
      return "linux";
  }
};
