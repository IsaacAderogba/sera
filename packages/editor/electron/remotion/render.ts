import {
  renderMedia,
  RenderMediaOnProgress,
  selectComposition
} from "@remotion/renderer";
import { app, shell } from "electron";
import log from "electron-log/main";
import os from "os";
import path from "path";

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
  inputProps: Record<string, unknown>,
  onProgress: RenderMediaOnProgress
) {
  const compositionId = "HelloWorld";

  const bundleLocation = path.join(app.getAppPath(), "out", "remotion-bundle");
  log.info(`Bundle location: ${bundleLocation}`);

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: compositionId,
    inputProps,
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
    inputProps,
    binariesDirectory,
    onProgress
  });
  log.info(`Video rendered: ${compositionId}.mp4`);

  shell.showItemInFolder(downloadsFolderPath);
  log.info("Shell opened /downloads folder");
}
