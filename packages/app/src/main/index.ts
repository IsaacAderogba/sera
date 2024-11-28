import { BrowserWindow, app, autoUpdater as electronUpdater } from "electron";
import { setContentSecurityPolicy } from "./policies";
import {
  activateWindows,
  beforeQuitWindows,
  initializeWindows
} from "./windows";
import { APP_MODEL_ID } from "./constants";

app
  .whenReady()
  .then(async () => {
    app.setAppUserModelId(APP_MODEL_ID);

    await initializeWindows();
    setContentSecurityPolicy();
  })
  .catch(e => console.error(e));

const beforeQuit = () => {
  beforeQuitWindows();

  for (const window of BrowserWindow.getAllWindows()) {
    window.removeAllListeners("close").setClosable(true);
    window.close();
  }
};

electronUpdater.on("before-quit-for-update", async () => {
  beforeQuit();
  app.exit();
});

app.on("before-quit", async e => {
  e.preventDefault();
  beforeQuit();
  app.exit();
});

app.on("activate", activateWindows);
