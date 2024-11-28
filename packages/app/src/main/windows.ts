import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  Menu,
  Tray,
  nativeImage,
  shell
} from "electron";
import path from "path";
import { debounce } from "../preload/utilities";
import { ELECTRON_RENDERER_URL, PUBLIC_FOLDER } from "./constants";
import {
  StoreState,
  WindowState,
  deleteWindowState,
  getWindowState,
  setWindowState,
  store
} from "./store";

export const activateWindows = async () => {
  const appWindow = BrowserWindow.getAllWindows().find(
    win => getWindowState(win.id) && !win.isDestroyed()
  );

  if (appWindow) {
    appWindow.show();
  } else {
    await createAppWindow();
  }
};

export const beforeQuitWindows = async () => {
  const windows = BrowserWindow.getAllWindows().filter(
    win => !win.isDestroyed()
  );

  const states: StoreState["windowStates"] = {};
  for (const window of windows) {
    const state = getWindowState(window.id);
    if (state) states[window.id] = state;
  }

  await store.set("windowStates", states);
};

export const initializeWindows = async () => {
  const states = Object.values((await store.get("windowStates")) || {});

  if (states.length) {
    await store.delete("windowStates");

    await Promise.all([
      ...states.map(state => createAppWindow(state)),
      createMenubarWindow()
    ]);
  } else {
    await Promise.all([createAppWindow(), createMenubarWindow()]);
  }
};

export const createAppWindow = async (state: Partial<WindowState> = {}) => {
  const bounds = { width: 1000, height: 800, ...state.bounds };

  const appWindow = createWindow("main", {
    ...bounds,
    minWidth: 500,
    minHeight: 400,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    trafficLightPosition: { x: 12, y: 16 }
  });

  setWindowState(appWindow.id, { bounds: appWindow.getBounds() });
  appWindow.once("ready-to-show", () => appWindow.show());

  const debouncedStateChange = debounce(() => {
    setWindowState(appWindow.id, { bounds: appWindow.getBounds() });
  }, 500);

  appWindow.on("resize", debouncedStateChange);
  appWindow.on("move", debouncedStateChange);

  appWindow.once("close", () => {
    appWindow.off("resize", debouncedStateChange);
    appWindow.off("move", debouncedStateChange);

    deleteWindowState(appWindow.id);
  });

  return appWindow;
};

const createMenubarWindow = async () => {
  const trayWindow = createWindow("menubar", {
    width: 350,
    height: 450,
    fullscreenable: false,
    resizable: false,
    maximizable: false,
    movable: false,
    frame: false,
    minimizable: false
  });

  trayWindow.setVisibleOnAllWorkspaces(true);
  trayWindow.setAlwaysOnTop(true);
  trayWindow.on("blur", () => trayWindow.hide());
  trayWindow.on("show", () => trayWindow.focus());

  const trayImage = nativeImage
    .createFromPath(path.join(PUBLIC_FOLDER, "logos", "template-logo.png"))
    .resize({ width: 22, height: 22 });
  trayImage.setTemplateImage(true);

  const tray = new Tray(trayImage);
  tray.setIgnoreDoubleClickEvents(true);

  tray.on("click", () => {
    if (trayWindow.isVisible()) return trayWindow.hide();

    const windowBounds = trayWindow.getBounds();
    const trayBounds = tray.getBounds();
    trayWindow.setPosition(
      Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2),
      Math.round(trayBounds.y + trayBounds.height),
      false
    );

    trayWindow.show();
  });

  tray.on("right-click", () => {
    tray.popUpContextMenu(Menu.buildFromTemplate([{ role: "quit" }]));
  });

  return trayWindow;
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
