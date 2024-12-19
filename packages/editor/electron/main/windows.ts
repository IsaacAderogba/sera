import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  shell
} from "electron";
import path from "path";
import { ELECTRON_RENDERER_URL } from "./constants";

export const activateWindows = async () => {
  const appWindow = BrowserWindow.getAllWindows().find(
    win => !win.isDestroyed()
  );

  if (appWindow) {
    appWindow.show();
  } else {
    await createAppWindow();
  }
};

export const initializeWindows = async () => {
  await createAppWindow();
};

const createAppWindow = async () => {
  const appWindow = createWindow("main", {
    width: 1000,
    height: 800,
    minWidth: 500,
    minHeight: 400,
    transparent: false,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    trafficLightPosition: { x: 12, y: 16 }
  });

  appWindow.once("ready-to-show", () => appWindow.show());

  return appWindow;
};

const createWindow = (
  type: "main" | "menubar",
  options: Partial<BrowserWindowConstructorOptions>
) => {
  const browserWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "..", "preload", "index.mjs"),
      sandbox: false,
      backgroundThrottling: false,
      partition: "persist:shared"
    },
    transparent: true,
    vibrancy: "fullscreen-ui",
    backgroundMaterial: "acrylic",
    ...options
  });

  browserWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (ELECTRON_RENDERER_URL) {
    browserWindow.loadURL(`${ELECTRON_RENDERER_URL}/${type}`);
  } else {
    browserWindow.loadFile(
      path.join(__dirname, "..", "renderer", `${type}.html`)
    );
  }

  return browserWindow;
};
