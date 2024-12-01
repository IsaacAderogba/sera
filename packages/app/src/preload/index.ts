import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";
import {
  Adapter,
  AdaptersInterface,
  Invoke,
  ItemRecord,
  Publish,
  Subscribe
} from "./ipc";

const invoke: Invoke = (subject, ...args) => {
  console.log("[invoke]", subject, ...args);
  return ipcRenderer.invoke("message", subject, ...args);
};

const publish: Publish = (subject, ...args) => {
  console.log("[publish]", subject, ...args);
  return ipcRenderer.send("message", subject, ...args);
};

const subscribe: Subscribe = (subject, listener) => {
  function handler(_e: IpcRendererEvent, ...args: Parameters<typeof listener>) {
    console.log(`[handle]`, subject, ...args);
    listener(...args);
  }

  console.log(`[subscribe]`, subject);
  ipcRenderer.on(subject, handler);

  return () => {
    ipcRenderer.removeListener(subject, handler);
    console.log(`[unsubscribe]`, subject);
  };
};

const createAdapter = <T extends keyof ItemRecord>(
  type: T
): Adapter<ItemRecord[T]> => {
  return {
    read: (...args) => ipcRenderer.invoke("message", `${type}:read`, ...args),
    list: (...args) => ipcRenderer.invoke("message", `${type}:list`, ...args),
    create: (...args) =>
      ipcRenderer.invoke("message", `${type}:create`, ...args),
    update: (...args) =>
      ipcRenderer.invoke("message", `${type}:update`, ...args),
    delete: (...args) =>
      ipcRenderer.invoke("message", `${type}:delete`, ...args)
  };
};

const adapters: AdaptersInterface = {
  user: createAdapter("user"),
  playlist: createAdapter("playlist"),
  song: createAdapter("song")
};

contextBridge.exposeInMainWorld("ipc", {
  invoke,
  publish,
  subscribe,
  adapters
});
