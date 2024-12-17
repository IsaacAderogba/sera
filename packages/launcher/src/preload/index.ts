import { contextBridge, ipcRenderer } from "electron";
import { Invoke } from "./types";

const invoke: Invoke = (subject, ...args) => {
  console.log("[invoke]", subject, ...args);
  return ipcRenderer.invoke("message", subject, ...args) as any;
};

contextBridge.exposeInMainWorld("ipc", { invoke });
