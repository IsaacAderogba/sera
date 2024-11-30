import os from "os";
import {
  IPCContext,
  IPCBroadcastEvents,
  IPCInvokeEvents,
  Platform
} from "../preload/types";
import {
  BrowserWindow,
  ipcMain,
  IpcMainEvent,
  IpcMainInvokeEvent,
  View,
  WebContentsView
} from "electron";
import { adapters } from "./database";

export function subscribeIPCHandlers() {
  ipcMain.on("message", onIPCBroadcast);
  ipcMain.handle("message", handleIPCInvoke);
}

export function unsubscribeIPCHandlers() {
  ipcMain.removeListener("message", onIPCBroadcast);
  ipcMain.removeHandler("message");
}

const handleIPCInvoke = async <T extends keyof IPCInvokeEvents>(
  event: IpcMainInvokeEvent,
  subject: T,
  ...data
) => {
  console.log("[invoke]", subject);

  const [namespace, method] = subject.split(":");
  const handler = adapters[namespace][method];
  if (handler) return await handler(...data);
};

const onIPCBroadcast = <T extends keyof IPCBroadcastEvents>(
  event: IpcMainEvent,
  subject: T,
  ...data: Parameters<IPCBroadcastEvents[T]>
) => broadcast(getWindowContext(event.sender.id), subject, ...data);

export const broadcast = <T extends keyof IPCBroadcastEvents>(
  context: IPCContext,
  subject: T,
  ...data: Parameters<IPCBroadcastEvents[T]>
) => {
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
};

export const getWindowContext = (viewId: number): IPCContext => {
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

export const isWebContentsView = (
  view: WebContentsView | View
): view is WebContentsView => {
  return view instanceof WebContentsView;
};

export const getPlatform = (): Platform => {
  switch (os.platform()) {
    case "darwin":
      return "mac";
    case "win32":
      return "windows";
    default:
      return "linux";
  }
};
