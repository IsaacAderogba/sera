declare global {
  interface Window {
    ipc: { invoke: Invoke };
  }
}

export type Invoke = <T extends keyof IPCInvokeEvents>(
  subject: T,
  ...data: Parameters<IPCInvokeEvents[T]>
) => ReturnType<IPCInvokeEvents[T]>;

export type IPCInvokeEvents = {
  generateMusic: (item: Item) => Promise<Item>;
  setThemeSource: (preference: ThemePreference) => Promise<void> | void;

  startDrag: (audioFilename: string) => void;
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
