import {
  BrowserWindow,
  app,
  autoUpdater as electronUpdater,
  ipcMain,
  session
} from "electron";
import { APP_MODEL_ID, SHARED_PARTITION } from "./constants";
import { onIPCInvoke } from "./invoke";
import {
  handleProtocols,
  registerProtocolSchemes,
  setContentSecurityPolicy
} from "./policies";
import { activateWindows, initializeWindows } from "./windows";

registerProtocolSchemes();

app
  .whenReady()
  .then(async () => {
    app.setAppUserModelId(APP_MODEL_ID);
    handleProtocols(session.fromPartition(SHARED_PARTITION));

    ipcMain.handle("message", onIPCInvoke);
    await initializeWindows();
    setContentSecurityPolicy();
  })
  .catch(e => console.error(e));

const beforeQuit = async () => {
  for (const window of BrowserWindow.getAllWindows()) {
    window.removeAllListeners("close").setClosable(true);
    window.close();
  }

  ipcMain.removeHandler("message");
  app.exit();
};

electronUpdater.on("before-quit-for-update", beforeQuit);
app.on("before-quit", async e => {
  e.preventDefault();
  await beforeQuit();
});

app.on("activate", activateWindows);
