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
  table: T
): Adapter<ItemRecord[T]> => {
  return {
    read: (...args) => ipcRenderer.invoke("message", `${table}:read`, ...args),
    list: (...args) => ipcRenderer.invoke("message", `${table}:list`, ...args),
    create: (...args) =>
      ipcRenderer.invoke("message", `${table}:create`, ...args),
    update: (...args) =>
      ipcRenderer.invoke("message", `${table}:update`, ...args),
    delete: (...args) =>
      ipcRenderer.invoke("message", `${table}:delete`, ...args)
  };
};

const adapters: AdaptersInterface = {
  profiles: createAdapter("profiles"),
  playlists: createAdapter("playlists"),
  songs: createAdapter("songs"),
  playlists_songs: createAdapter("playlists_songs")
};

contextBridge.exposeInMainWorld("ipc", {
  invoke,
  publish,
  subscribe,
  adapters
});
