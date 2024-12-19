import { IpcMainInvokeEvent, nativeTheme } from "electron";
import { IPCInvokeEvents } from "../preload/types";

export const onIPCInvoke = async <T extends keyof IPCInvokeEvents>(
  _event: IpcMainInvokeEvent,
  subject: T,
  ...data
) => {
  console.log("[invoke]", subject);

  const handlers: Partial<IPCInvokeEvents> = {
    setThemeSource: async themeSource => {
      nativeTheme.themeSource = themeSource;
    }
  };

  const handler = handlers[subject];
  // @ts-expect-error - A spread argument must either have a tuple type or be passed to a rest parameter.ts
  return await handler?.(...data);
};
