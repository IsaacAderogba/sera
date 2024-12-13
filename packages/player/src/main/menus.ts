import {
  BaseWindow,
  BrowserWindow,
  Menu,
  MenuItemConstructorOptions,
  Notification,
  app,
  shell
} from "electron";
import { createAppWindow } from "./windows";
import { getWindowState } from "./store";
import { checkForUpdates } from "./updater";

export const initializeMenus = async () => {
  const template = [
    getFileMenu(),
    getEditMenu(),
    getViewMenu(),
    getWindowMenu(),
    getHelpMenu()
  ];

  if (process.platform === "darwin") {
    template.unshift(getSeraMenu());
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

const getSeraMenu = (): MenuItemConstructorOptions => {
  const name = "Sera";
  return {
    label: name,
    submenu: [
      {
        label: "About " + name,
        role: "about"
      },
      {
        type: "separator"
      },
      {
        label: "Services",
        role: "services",
        submenu: []
      },
      {
        type: "separator"
      },
      {
        label: "Hide " + name,
        accelerator: "Command+H",
        role: "hide"
      },
      {
        label: "Hide Others",
        accelerator: "Command+Shift+H",
        role: "hideOthers"
      },
      {
        label: "Show All",
        role: "unhide"
      },
      {
        type: "separator"
      },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: function () {
          app.quit();
        }
      }
    ]
  };
};

const getFileMenu = (): MenuItemConstructorOptions => {
  return {
    label: "File",
    submenu: [
      {
        label: "New Window",
        accelerator: "CmdOrCtrl+N",
        click: async () => {
          await createAppWindow();
        }
      },
      { type: "separator" },
      {
        label: "Close Window",
        accelerator: "CmdOrCtrl+W",
        click: async () => {
          const appWindow = BrowserWindow.getAllWindows().find(
            win => getWindowState(win.id) && win.isFocused()
          );

          if (appWindow) {
            appWindow.close();
          }
        }
      }
    ]
  };
};

const getEditMenu = (): MenuItemConstructorOptions => {
  return {
    label: "Edit",
    submenu: [
      {
        label: "Undo",
        accelerator: "CmdOrCtrl+Z",
        role: "undo"
      },
      {
        label: "Redo",
        accelerator: "Shift+CmdOrCtrl+Z",
        role: "redo"
      },
      {
        type: "separator"
      },
      {
        label: "Cut",
        accelerator: "CmdOrCtrl+X",
        role: "cut"
      },
      {
        label: "Copy",
        accelerator: "CmdOrCtrl+C",
        role: "copy"
      },
      {
        label: "Paste",
        accelerator: "CmdOrCtrl+V",
        role: "paste"
      },
      {
        label: "Select All",
        accelerator: "CmdOrCtrl+A",
        role: "selectAll"
      }
    ]
  };
};

const getViewMenu = (): MenuItemConstructorOptions => {
  return {
    label: "View",
    submenu: [
      {
        label: "Reload",
        accelerator: "CmdOrCtrl+R",
        click: function (_, focusedWindow) {
          if (isBrowserWindow(focusedWindow)) {
            focusedWindow.reload();
          }
        }
      },
      {
        label: "Toggle Full Screen",
        accelerator: (function () {
          if (process.platform === "darwin") return "Ctrl+Command+F";
          else return "F11";
        })(),
        click: function (_, focusedWindow) {
          if (isBrowserWindow(focusedWindow)) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        }
      },
      {
        label: "Toggle Developer Tools",
        accelerator: (function () {
          if (process.platform === "darwin") return "Alt+Command+I";
          else return "Ctrl+Shift+I";
        })(),
        click: function (_, focusedWindow) {
          if (isBrowserWindow(focusedWindow)) {
            focusedWindow.webContents.toggleDevTools();
          }
        }
      }
    ]
  };
};

const getWindowMenu = (): MenuItemConstructorOptions => {
  return {
    label: "Window",
    role: "window",
    submenu: [
      {
        label: "Minimize",
        accelerator: "CmdOrCtrl+M",
        role: "minimize"
      },
      {
        label: "Close",
        accelerator: "CmdOrCtrl+W",
        role: "close"
      }
    ]
  };
};

const getHelpMenu = (): MenuItemConstructorOptions => {
  return {
    label: "Help",
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: function () {
          shell.openExternal("https://github.com/IsaacAderogba/sera");
        }
      },
      {
        label: "Check for Updates…",
        click: async () => {
          const checkingForUpdateTimeout = setTimeout(() => {
            const notification = new Notification({
              title: "Checking for update..."
            });

            notification.show();
          }, 2000);

          const updateInfo = await checkForUpdates();
          clearTimeout(checkingForUpdateTimeout);

          if (!updateInfo) {
            const notification = new Notification({
              title: "Update not available"
            });

            notification.show();
          }
        }
      }
    ]
  };
};

const isBrowserWindow = (
  window: BaseWindow | BrowserWindow | undefined
): window is BrowserWindow => {
  return window instanceof BrowserWindow;
};
