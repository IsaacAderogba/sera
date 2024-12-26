import { parseMedia } from "@remotion/media-parser";
import { nodeReader } from "@remotion/media-parser/node";
import { app, dialog, IpcMainInvokeEvent } from "electron";
import log from "electron-log/main.js";
import { ElevenLabsClient } from "elevenlabs";
import fs from "fs";
import path from "path";
import { v4 } from "uuid";
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
  importTrackItem: async type => {
    const id = v4();
    const date = new Date().toISOString();

    switch (type) {
      case "mp3": {
        const client = new ElevenLabsClient({
          apiKey: import.meta.env["MAIN_VITE_ELEVENLABS_API_KEY"]
        });

        const duration = 15;
        const readable = await client.textToSoundEffects.convert({
          text: "Sample background music",
          duration_seconds: duration
        });

        const src = await new Promise<string>((resolve, reject) => {
          const name = `${id}.mp3`;
          const writable = fs.createWriteStream(
            path.join(app.getPath("userData"), "audio", name)
          );
          readable.pipe(writable);
          writable.on("finish", () => {
            console.log("Audio has been written successfully!");
            resolve(name);
          });

          writable.on("error", err => {
            console.error("Error writing file:", err);
            reject(err);
          });

          return name;
        });

        return {
          id,
          trackId: "",
          name: "Audio Example",
          type: "audio",
          from: 0,
          duration,
          playbackRate: 1,
          data: { src },
          createdAt: date,
          updatedAt: date
        };
      }
      // just select a local mp4 file since elevenlabs doesn't generate video
      case "mp4": {
        const { filePaths } = await dialog.showOpenDialog({
          properties: ["openFile"],
          filters: [{ name: "Select", extensions: [type] }]
        });
        if (!filePaths.length) return null;

        const src = filePaths[0];
        const { durationInSeconds } = await parseMedia({
          src,
          fields: { durationInSeconds: true },
          reader: nodeReader
        });

        if (!durationInSeconds) return null;

        const filename = `${id}-${path.basename(src)}`;
        const dest = path.join(app.getPath("userData"), "video", filename);
        fs.copyFileSync(src, dest);

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
