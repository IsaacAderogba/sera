import { BrowserWindow, IpcMainEvent } from "electron";
import { IPCBroadcastAPI } from "../preload/types";
import { getIPCEvent } from "./utilities";
import { isWebContentsView } from "./assertions";

export const onIPCBroadcast = async <T extends keyof IPCBroadcastAPI>(
  event: IpcMainEvent,
  subject: T,
  ...data: Parameters<IPCBroadcastAPI[T]>
) => broadcast(event.sender.id, subject, ...data);

export const broadcast = async <T extends keyof IPCBroadcastAPI>(
  webContentsId: number,
  subject: T,
  ...data: Parameters<IPCBroadcastAPI[T]>
) => {
  const event = getIPCEvent(webContentsId);
  const windows = BrowserWindow.getAllWindows().filter(
    win => win.id !== event.windowId
  );

  for (const window of windows) {
    window.webContents.send(subject, event, ...data);

    for (const view of window.contentView.children) {
      if (!isWebContentsView(view)) continue;
      view.webContents.send(subject, event, ...data);
    }
  }

  // @ts-expect-error - A spread argument must either have a tuple type or be passed to a rest parameter
  await handlers[subject]?.(...data);
};

const handlers: Partial<IPCBroadcastAPI> = {};
