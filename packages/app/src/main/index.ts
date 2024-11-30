import { BrowserWindow, app, autoUpdater as electronUpdater } from "electron";
import { setContentSecurityPolicy } from "./policies";
import {
  activateWindows,
  beforeQuitWindows,
  initializeWindows
} from "./windows";
import { APP_MODEL_ID } from "./constants";
import { checkForUpdates } from "./updater";
import { subscribeIPCHandlers, unsubscribeIPCHandlers } from "./ipc";
import { connectDatabase, disconnectDatabase } from "./database";

const databaseConnection = connectDatabase();

app
  .whenReady()
  .then(async () => {
    app.setAppUserModelId(APP_MODEL_ID);

    subscribeIPCHandlers();
    await databaseConnection;
    await initializeWindows();
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

  unsubscribeIPCHandlers();
  await disconnectDatabase();
  app.exit();
};

electronUpdater.on("before-quit-for-update", beforeQuit);
app.on("before-quit", async e => {
  e.preventDefault();
  await beforeQuit();
});

app.on("activate", activateWindows);
