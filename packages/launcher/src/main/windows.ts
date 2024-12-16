import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  globalShortcut,
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

export const createAppWindow = async () => {
  const panelWindow = createWindow("main", {
    type: "panel",
    width: 640,
    height: 380,
    fullscreenable: false,
    resizable: false,
    maximizable: false,
    center: true,
    frame: false,
    minimizable: false,
    closable: false
  });

  panelWindow.setVisibleOnAllWorkspaces(true);
  // panelWindow.on("blur", () => panelWindow.hide());
  // panelWindow.on("show", () => panelWindow.focus());
  panelWindow.on("close", e => {
    e.preventDefault();
    panelWindow.hide();
  });

  const togglePanelWindow = () => {
    if (panelWindow.isVisible()) return panelWindow.hide();
    panelWindow.moveTop();
    panelWindow.show();
  };

  globalShortcut.register("CommandOrControl+Shift+Space", () => {
    togglePanelWindow();
  });

  return panelWindow;
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
      backgroundThrottling: false
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
