import { Notification, dialog } from "electron";
import { autoUpdater } from "electron-updater";

autoUpdater.setFeedURL({
  provider: "github",
  owner: "IsaacAderogba",
  repo: "sera"
});

autoUpdater.on("error", (_, message) => {
  const notification = new Notification({
    title: "Update error",
    body: message
  });

  notification.show();
});

autoUpdater.on("update-available", info => {
  const notification = new Notification({
    title: "Update available",
    body: `Version ${info.version} of Pine is available and will download in the background.`
  });

  notification.show();
});

autoUpdater.on("update-downloaded", async () => {
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
  await autoUpdater.checkForUpdates();
};

export { autoUpdater };
