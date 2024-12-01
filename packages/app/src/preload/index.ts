import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";
import {
  Adapter,
  Invoke,
  PlaylistAdapter,
  Publish,
  SongAdapter,
  Subscribe,
  UserAdapter
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

const createAdapter = <T extends Adapter>(): T => {
  throw new Error("Unimplemented");
  // uses invoke api
  // ipcRenderer.invoke("message", subject, ...args)
};

contextBridge.exposeInMainWorld("ipc", {
  invoke,
  publish,
  subscribe,
  users: createAdapter<UserAdapter>(),
  playlists: createAdapter<PlaylistAdapter>(),
  songs: createAdapter<SongAdapter>()
});
