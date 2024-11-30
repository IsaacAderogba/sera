declare global {
  interface Window {
    ipc: {
      invoke: Invoke;
      publish: Publish;
      subscribe: Subscribe;
    };
  }
}

export type Invoke = <T extends keyof IPCInvokeEvents>(
  subject: T,
  ...data: Parameters<IPCInvokeEvents[T]>
) => Promise<ReturnType<Awaited<IPCInvokeEvents[T]>>>;

export type Publish = <T extends keyof IPCBroadcastEvents>(
  subject: T,
  ...data: Parameters<IPCBroadcastEvents[T]>
) => void;

export type Subscribe = <T extends keyof IPCBroadcastEvents>(
  subject: T,
  listener: (
    context: IPCContext,
    ...data: Parameters<IPCBroadcastEvents[T]>
  ) => void
) => () => void;

export type IPCBroadcastEvents = {
  foo: () => Promise<void>;
};

export type IPCInvokeEvents = {
  foo: (hi: string) => Promise<boolean>;
  bar: (oh: number) => Promise<number>;
};

export interface IPCContext {
  platform: Platform;
  viewId: number;
  windowId: number;
}

export type Platform = "mac" | "windows" | "linux";
