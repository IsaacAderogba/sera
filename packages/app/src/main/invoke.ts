import { IpcMainInvokeEvent } from "electron";
import { IPCInvokeEvents } from "../preload/ipc";
import { adapters } from "./database";

export const onIPCInvoke = async <T extends keyof IPCInvokeEvents>(
  event: IpcMainInvokeEvent,
  subject: T,
  ...data
) => {
  console.log("[invoke]", subject);

  const [namespace, method] = subject.split(":");
  const handler = adapters[namespace][method];
  if (handler) return await handler(...data);
};
