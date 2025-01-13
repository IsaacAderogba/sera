import { BrowserWindow } from "electron";
import os from "os";
import { IPCEvent, Platform } from "../preload/types";
import { isWebContentsView } from "./assertions";

export const getIPCEvent = (webContentsId: number): IPCEvent => {
  const windows = BrowserWindow.getAllWindows();

  const win = windows.find(window => {
    const isOwnView = window.webContents.id === webContentsId;
    const isChildView = window.contentView.children.some(view => {
      return isWebContentsView(view)
        ? view.webContents.id === webContentsId
        : false;
    });

    return isOwnView || isChildView;
  });

  return { windowId: win?.id || -1, platform: getPlatform() };
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
