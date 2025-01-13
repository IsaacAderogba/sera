import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  globalShortcut,
  shell
} from "electron";
import path from "path";
import { ELECTRON_RENDERER_URL, SHARED_PARTITION } from "./constants";
import { MAIN_WINDOW_HEIGHT, MAIN_WINDOW_WIDTH } from "../preload/constants";

export const activateWindows = async () => {
  const appWindow = BrowserWindow.getAllWindows().find(
    win => !win.isDestroyed()
  );

  if (appWindow) {
    appWindow.show();
  } else {
    await createMainWindow();
  }
};

export const initializeWindows = async () => {
  await createMainWindow();
};

export const createMainWindow = async () => {
  const win = createWindow("main", {
    type: "panel",
    width: MAIN_WINDOW_WIDTH,
    height: MAIN_WINDOW_HEIGHT,
    fullscreenable: false,
    resizable: false,
    maximizable: false,
    center: true,
    frame: false,
    minimizable: false,
    closable: false
  });

  win.setVisibleOnAllWorkspaces(true);
  // win.on("blur", () => win.hide());
  win.on("show", () => win.focus());
  win.on("close", e => {
    e.preventDefault();
    win.hide();
  });

  globalShortcut.register("CommandOrControl+Shift+Space", () => {
    if (win.isVisible()) return win.hide();
    win.moveTop();
    win.show();
  });

  return win;
};

const createWindow = (
  type: "main",
  options: Partial<BrowserWindowConstructorOptions>
) => {
  const browserWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "..", "preload", "index.mjs"),
      sandbox: false,
      backgroundThrottling: false,
      partition: SHARED_PARTITION
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
