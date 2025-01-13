import { IpcMainInvokeEvent } from "electron";
import { IPCInvokeAPI } from "../preload/types";
import { getIPCEvent } from "./utilities";

export const onIPCInvoke = async <T extends keyof IPCInvokeAPI>(
  _event: IpcMainInvokeEvent,
  subject: T,
  ...data: Parameters<IPCInvokeAPI[T]>
) => invoke(_event.sender.id, subject, ...data);

export const invoke = async <T extends keyof IPCInvokeAPI>(
  webContentsId: number,
  subject: T,
  ...data: Parameters<IPCInvokeAPI[T]>
) => {
  getIPCEvent(webContentsId);

  // @ts-expect-error - A spread argument must either have a tuple type or be passed to a rest parameter
  return await handlers[subject]?.(...data);
};

const handlers: Partial<IPCInvokeAPI> = {};
