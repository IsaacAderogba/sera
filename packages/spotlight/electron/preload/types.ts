import { InterfaceThemePreference } from "./store";

export type Invoke = <T extends keyof IPCInvokeAPI>(
  subject: T,
  ...data: Parameters<IPCInvokeAPI[T]>
) => ReturnType<IPCInvokeAPI[T]>;

export type Publish = <T extends keyof IPCBroadcastAPI>(
  subject: T,
  ...data: Parameters<IPCBroadcastAPI[T]>
) => void;

export type Subscribe = <T extends keyof IPCBroadcastAPI>(
  subject: T,
  listener: (event: IPCEvent, ...data: Parameters<IPCBroadcastAPI[T]>) => void
) => Unsubscribe;

export type Unsubscribe = () => void;

export type IPCBroadcastAPI = {
  themeChange: (theme: InterfaceThemePreference) => Promise<void> | void;
};

export type IPCInvokeAPI = {
  bar: () => Promise<void>;
};

export type IPCEvent = {
  platform: Platform;
  windowId: number;
};
export type Platform = "mac" | "windows" | "linux";

declare global {
  interface Window {
    ipc: {
      invoke: Invoke;
      publish: Publish;
      subscribe: Subscribe;
    };
  }
}
