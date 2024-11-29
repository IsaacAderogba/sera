import { BrowserWindow, app, autoUpdater as electronUpdater } from "electron";
import { setContentSecurityPolicy } from "./policies";
import {
  activateWindows,
  beforeQuitWindows,
  initializeWindows
} from "./windows";
import { APP_MODEL_ID } from "./constants";
import { autoUpdater } from "./updater";

app
  .whenReady()
  .then(async () => {
    app.setAppUserModelId(APP_MODEL_ID);

    await initializeWindows();
    setContentSecurityPolicy();

    await autoUpdater.checkForUpdates();
  })
  .catch(e => console.error(e));

const beforeQuit = () => {
  beforeQuitWindows();

  for (const window of BrowserWindow.getAllWindows()) {
    window.removeAllListeners("close").setClosable(true);
    window.close();
  }

  app.exit();
};

electronUpdater.on("before-quit-for-update", beforeQuit);
app.on("before-quit", async e => {
  e.preventDefault();
  beforeQuit();
});

app.on("activate", activateWindows);
