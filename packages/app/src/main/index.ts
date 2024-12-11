import {
  BrowserWindow,
  app,
  autoUpdater as electronUpdater,
  ipcMain
} from "electron";
import { APP_MODEL_ID } from "./constants";
import { connectDatabase, disconnectDatabase } from "./database";
import { onIPCInvoke } from "./invoke";
import { handleProtocols, setContentSecurityPolicy } from "./policies";
import { checkForUpdates } from "./updater";
import {
  activateWindows,
  beforeQuitWindows,
  initializeWindows
} from "./windows";
import { onIPCBroadcast } from "./broadcast";
import { initializeMenus } from "./menus";

const databaseConnection = connectDatabase();

app
  .whenReady()
  .then(async () => {
    app.setAppUserModelId(APP_MODEL_ID);
    handleProtocols();

    ipcMain.on("message", onIPCBroadcast);
    ipcMain.handle("message", onIPCInvoke);
    await databaseConnection;
    await initializeWindows();
    await initializeMenus();
    setContentSecurityPolicy();

    await checkForUpdates();
  })
  .catch(e => console.error(e));

const beforeQuit = async () => {
  beforeQuitWindows();

  for (const window of BrowserWindow.getAllWindows()) {
    window.removeAllListeners("close").setClosable(true);
    window.close();
  }

  ipcMain.removeListener("message", onIPCBroadcast);
  ipcMain.removeHandler("message");
  await disconnectDatabase();
  app.exit();
};

electronUpdater.on("before-quit-for-update", beforeQuit);
app.on("before-quit", async e => {
  e.preventDefault();
  await beforeQuit();
});

app.on("activate", activateWindows);
