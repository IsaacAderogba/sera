import type { RenderMediaOnProgress } from "@remotion/renderer";

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
) => ReturnType<IPCInvokeEvents[T]>;

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
  themeChange: (preference: ThemePreference) => Promise<void>;
  renderChange: RenderMediaOnProgress;
};

export type IPCInvokeEvents = {
  render: (props: any) => Promise<void>;
  bundle: (props: any) => Promise<void>;
};

export interface IPCContext {
  platform: Platform;
  viewId: number;
  windowId: number;
}

export type Platform = "mac" | "windows" | "linux";

export type ThemePreference = "dark" | "light" | "system";
export type ThemeMode = "dark" | "light";
export type Item = {
  id: string;
  prompt: string;
  audioFilename: string;
  audioDuration: number;
};
