import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";
import { Invoke, Publish, Subscribe } from "./types";

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

contextBridge.exposeInMainWorld("ipc", {
  getWindowContext: () => ipcRenderer.sendSync("message", "getWindowContext"),
  invoke,
  publish,
  subscribe
});
