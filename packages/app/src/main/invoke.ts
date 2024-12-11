import { ElevenLabsClient } from "elevenlabs";
import { app, IpcMainInvokeEvent } from "electron";
import { IPCInvokeEvents } from "../preload/types";
import { adapters } from "./database";
import path from "path";
import fs from "fs";

export const onIPCInvoke = async <T extends keyof IPCInvokeEvents>(
  event: IpcMainInvokeEvent,
  subject: T,
  ...data
) => {
  console.log("[invoke]", subject);

  const [namespace, method] = subject.split(":");
  let handler = adapters[namespace]?.[method];
  if (handler) return await handler(...data);

  const handlers: Partial<IPCInvokeEvents> = {
    canGoBack: async () => event.sender.navigationHistory.canGoBack(),
    goBack: async () => event.sender.navigationHistory.goBack(),
    canGoForward: async () => event.sender.navigationHistory.canGoForward(),
    goForward: async () => event.sender.navigationHistory.goForward(),

    generateBackgroundMusic: async song => {
      const client = new ElevenLabsClient({
        apiKey: import.meta.env["MAIN_VITE_ELEVENLABS_API_KEY"]
      });

      const readable = await client.textToSoundEffects.convert({
        text: song.data.description,
        duration_seconds: 15
      });

      const audioFilename = await new Promise<string>((resolve, reject) => {
        const audioFilename = `${song.id}-${new Date().getTime()}.mp3`;
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

      await adapters.songs.update(song.id, {
        data: { audioFilename, audioMetadata: { durationSeconds: 15 } }
      });

      return audioFilename;
    }
  };

  handler = handlers[subject];
  if (handler) return await handler(...data);
};
