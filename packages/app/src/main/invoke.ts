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
  let handler = adapters[namespace]?.[method];
  if (handler) return await handler(...data);

  const handlers: Partial<IPCInvokeEvents> = {
    canGoBack: async () => event.sender.navigationHistory.canGoBack(),
    goBack: async () => event.sender.navigationHistory.goBack(),
    canGoForward: async () => event.sender.navigationHistory.canGoForward(),
    goForward: async () => event.sender.navigationHistory.goForward()
  };

  handler = handlers[subject];
  if (handler) return await handler(...data);
};
