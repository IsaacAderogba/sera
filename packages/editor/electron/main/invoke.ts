import { app, IpcMainInvokeEvent, webUtils } from "electron";
import log from "electron-log/main.js";
import fs from "fs/promises";
import { IPCInvokeEvents } from "../preload/types";
import { bundle } from "../remotion/bundle";
import { render } from "../remotion/render";
import { broadcast } from "./broadcast";
import path from "path";
import { v4 } from "uuid";
import { parseMedia } from "@remotion/media-parser";
import { nodeReader } from "@remotion/media-parser/node";

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
  importTrackItem: async file => {
    const src = webUtils.getPathForFile(file);
    console.log("file type", file.type);

    const { durationInSeconds } = await parseMedia({
      src,
      fields: { durationInSeconds: true },
      reader: nodeReader
    });
    if (!durationInSeconds) return null;

    const id = v4();
    const date = new Date().toISOString();
    const filename = `${id}-${file.name}`;

    switch (file.type) {
      case "mp4": {
        const dest = path.join(app.getPath("userData"), "video", filename);
        await fs.copyFile(src, dest);

        return {
          id,
          trackId: "",
          name: "Video Example",
          type: "video",
          from: 0,
          duration: durationInSeconds,
          playbackRate: 1,
          data: { src: filename },
          createdAt: date,
          updatedAt: date
        };
      }
      case "mp3": {
        const dest = path.join(app.getPath("userData"), "video", filename);
        await fs.copyFile(src, dest);

        return {
          id,
          trackId: "",
          name: "Audio Example",
          type: "audio",
          from: 0,
          duration: durationInSeconds,
          playbackRate: 1,
          data: { src: filename },
          createdAt: date,
          updatedAt: date
        };
      }
    }

    return null;
  },
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
