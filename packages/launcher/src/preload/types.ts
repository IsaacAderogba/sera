declare global {
  interface Window {
    ipc: { invoke: Invoke };
  }
}

export type Invoke = <T extends keyof IPCInvokeEvents>(
  subject: T,
  ...data: Parameters<IPCInvokeEvents[T]>
) => ReturnType<IPCInvokeEvents[T]>;

export type ThemePreference = "dark" | "light" | "system";
export type ThemeMode = "dark" | "light";

export type IPCInvokeEvents = {
  generateMusic: (description: string) => Promise<string>;
  setThemeSource: (preference: ThemePreference) => Promise<void> | void;
};

export interface IPCContext {
  platform: Platform;
  viewId: number;
  windowId: number;
}

export type Platform = "mac" | "windows" | "linux";
