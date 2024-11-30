import { Notification, dialog } from "electron";
import { autoUpdater } from "electron-updater";
import { NODE_ENV } from "./constants";

autoUpdater.setFeedURL({
  provider: "github",
  owner: "IsaacAderogba",
  repo: "sera"
});

autoUpdater.on("error", (_, message) => {
  console.log("sera-update-error", message);
  const notification = new Notification({
    title: "Update error",
    body: message
  });

  notification.show();
});

autoUpdater.on("update-available", info => {
  console.log("sera-update-available", info);
  const notification = new Notification({
    title: "Update available",
    body: `Version ${info.version} of Pine is available and will download in the background.`
  });

  notification.show();
});

autoUpdater.on("update-downloaded", async info => {
  console.log("sera-update-downloaded", info);
  if (NODE_ENV === "test") return;

  const { response } = await dialog.showMessageBox({
    type: "info",
    buttons: ["Install and restart", "Install on next launch"],
    message: "Update downloaded",
    detail: `Do you want to install the updates now or on next launch?`
  });

  if (response === 0) {
    autoUpdater.quitAndInstall(false, true);
  }
});

export const checkForUpdates = async () => {
  try {
    await autoUpdater.checkForUpdates();
  } catch (err) {
    console.log(`Error checking for updates`, err);
  }
};
