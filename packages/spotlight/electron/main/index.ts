import { app, BrowserWindow, ipcMain } from "electron";
import { registerProtocolSchemes, setContentSecurityPolicy } from "./policies";
import { APP_MODEL_ID } from "./constants";
import { onIPCInvoke } from "./invoke";
import { onIPCBroadcast } from "./broadcast";
import { activateWindows, initializeWindows } from "./windows";

registerProtocolSchemes();

app
  .whenReady()
  .then(async () => {
    app.setAppUserModelId(APP_MODEL_ID);

    ipcMain.on("message", onIPCBroadcast);
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

  ipcMain.removeListener("message", onIPCBroadcast);
  ipcMain.removeHandler("message");
  app.exit();
};

app.on("before-quit", async e => {
  e.preventDefault();
  await beforeQuit();
});

app.on("activate", activateWindows);
