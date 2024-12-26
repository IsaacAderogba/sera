import {
  renderMedia,
  RenderMediaOnProgress,
  selectComposition
} from "@remotion/renderer";
import cors from "cors";
import { app, shell } from "electron";
import log from "electron-log/main.js";
import express, { json } from "express";
import { cloneDeep } from "lodash-es";
import path from "path";
import { getFileHeaders } from "../main/file";
import { CompositionState } from "../preload/types";

function isMusl(): boolean {
  // @ts-expect-error no types
  const { glibcVersionRuntime } = process.report.getReport().header;
  return !glibcVersionRuntime;
}

function getModuleName(): string {
  switch (process.platform) {
    case "win32":
      switch (process.arch) {
        case "x64":
          return "@remotion/compositor-win32-x64-msvc";
        default:
          throw new Error(
            `Unsupported architecture on Windows: ${process.arch}`
          );
      }
    case "darwin":
      switch (process.arch) {
        case "x64":
          return "@remotion/compositor-darwin-x64";
        case "arm64":
          return "@remotion/compositor-darwin-arm64";
        default:
          throw new Error(`Unsupported architecture on macOS: ${process.arch}`);
      }
    case "linux": {
      const musl = isMusl();
      switch (process.arch) {
        case "x64":
          if (musl) {
            return "@remotion/compositor-linux-x64-musl";
          }
          return "@remotion/compositor-linux-x64-gnu";
        case "arm64":
          if (musl) {
            return "@remotion/compositor-linux-arm64-musl";
          }
          return "@remotion/compositor-linux-arm64-gnu";
        default:
          throw new Error(`Unsupported architecture on Linux: ${process.arch}`);
      }
    }
    default:
      throw new Error(
        `Unsupported OS: ${process.platform}, architecture: ${process.arch}`
      );
  }
}

let binariesDirectory: string | null = null;
if (app.isPackaged) {
  const pathName = `node_modules/${getModuleName()}`;

  binariesDirectory = path.join(
    app.getAppPath().replace("app.asar", "app.asar.unpacked"),
    pathName
  );
  log.info(`Binaries directory: ${binariesDirectory}`);
}

export async function render(
  compositionState: CompositionState,
  onProgress: RenderMediaOnProgress
) {
  return new Promise(resolve => {
    const application = express();
    application.use(json());
    application.use(cors());

    const PORT = 4521;
    application.use("/assets", async (req, res) => {
      const [_, type, filename] = req.url.split("/");
      const filepath = path.join(app.getPath("userData"), type, filename);

      const headers = await getFileHeaders(filepath);
      for (const key in headers) {
        res.setHeader(key, headers[key]);
      }

      res.sendFile(filepath, error => {
        console.error("error sending filee", error);
      });
    });

    const server = application.listen(PORT, async () => {
      const proxiedComposition = cloneDeep(compositionState);
      for (const id in proxiedComposition.trackItems) {
        const trackItem = proxiedComposition.trackItems[id];
        switch (trackItem.type) {
          case "video":
            trackItem.data.src = `http://localhost:${PORT}/assets/video/${trackItem.data.src}`;
            break;
          case "audio":
            trackItem.data.src = `http://localhost:${PORT}/assets/audio/${trackItem.data.src}`;
            break;
        }
      }

      try {
        const compositionId = "DefaultComposition";
        const bundleLocation = path.join(
          app.getAppPath(),
          "out",
          "remotion-bundle"
        );
        log.info(`Bundle location: ${bundleLocation}`);

        const composition = await selectComposition({
          serveUrl: bundleLocation,
          id: compositionId,
          inputProps: proxiedComposition,
          binariesDirectory
        });
        log.info(`Composition selected: ${composition.id}`);

        const downloadsFolderPath = path.join(
          app.getPath("downloads"),
          "output-remotion.mp4"
        );
        log.info(`Downloads folder path: ${downloadsFolderPath}`);

        log.info(`Rendering video: ${compositionId}.mp4`);
        await renderMedia({
          composition,
          serveUrl: bundleLocation,
          codec: "h264",
          outputLocation: downloadsFolderPath,
          inputProps: proxiedComposition,
          binariesDirectory,
          onProgress
        });
        log.info(`Video rendered: ${compositionId}.mp4`);

        shell.showItemInFolder(downloadsFolderPath);
        log.info("Shell opened /downloads folder");
      } catch (err) {
        console.error(err);
      } finally {
        server.close();
        resolve(undefined);
      }
    });
  });
}
