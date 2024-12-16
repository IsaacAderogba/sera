import { ElevenLabsClient } from "elevenlabs";
import { app, IpcMainInvokeEvent, nativeTheme } from "electron";
import { IPCInvokeEvents } from "../preload/types";
import path from "path";
import fs from "fs";

export const onIPCInvoke = async <T extends keyof IPCInvokeEvents>(
  _event: IpcMainInvokeEvent,
  subject: T,
  ...data
) => {
  console.log("[invoke]", subject);

  const handlers: Partial<IPCInvokeEvents> = {
    setThemeSource: async themeSource => {
      nativeTheme.themeSource = themeSource;
    },
    generateMusic: async description => {
      const client = new ElevenLabsClient({
        apiKey: import.meta.env["MAIN_VITE_ELEVENLABS_API_KEY"]
      });
      const readable = await client.textToSoundEffects.convert({
        text: description,
        duration_seconds: 15
      });
      const audioFilename = await new Promise<string>((resolve, reject) => {
        const audioFilename = `${new Date().getTime()}.mp3`;
        const audioPath = path.join(app.getPath("userData"), audioFilename);
        console.log("audio path", audioPath);
        const writable = fs.createWriteStream(audioPath);
        readable.pipe(writable);
        writable.on("finish", () => {
          console.log("Audio has been written successfully!");
          resolve(audioFilename);
        });
        writable.on("error", err => {
          console.error("Error writing file:", err);
          reject(err);
        });
        return audioPath;
      });

      return audioFilename;
    }
  };

  const handler = handlers[subject];
  // @ts-expect-error - A spread argument must either have a tuple type or be passed to a rest parameter.ts
  return await handler?.(...data);
};
