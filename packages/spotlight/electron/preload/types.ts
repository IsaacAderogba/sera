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
  listener: (
    context: IPCContext,
    ...data: Parameters<IPCBroadcastAPI[T]>
  ) => void
) => Unsubscribe;

export type Unsubscribe = () => void;

export type IPCBroadcastAPI = {
  foo: () => void;
};

export type IPCInvokeAPI = {
  bar: () => void;
};

export type IPCContext = {
  platform: Platform;
  windowId: number;
  viewId: number;
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
