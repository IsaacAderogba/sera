import { IpcMainInvokeEvent } from "electron";
import log from "electron-log/main";
import { IPCInvokeEvents } from "../preload/types";
import { bundle } from "../remotion/bundle";
import { render } from "../remotion/render";
import { broadcast } from "./broadcast";

export const onIPCInvoke = async <T extends keyof IPCInvokeEvents>(
  _event: IpcMainInvokeEvent,
  subject: T,
  ...data
) => {
  console.log("[invoke]", subject);

  const handler = handlers[subject];
  // @ts-expect-error - A spread argument must either have a tuple type or be passed to a rest parameter.ts
  return await handler?.(...data);
};

const handlers: Partial<IPCInvokeEvents> = {
  bundle: async () => bundle(),
  render: async props => {
    try {
      log.info("Rendering media...");
      await render(props, progress => {
        broadcast(-1, "renderChange", progress);
      });
    } catch (error) {
      log.error("Failed to render media:", error);
    }
  }
};
