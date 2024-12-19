import { app, session } from "electron";
import path from "path";
import { DEEPLINK_PROTOCOL } from "./constants";

export const registerProtocolSchemes = () => {
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient(DEEPLINK_PROTOCOL, process.execPath, [
        path.resolve(process.argv[1])
      ]);
    }
  } else {
    app.setAsDefaultProtocolClient(DEEPLINK_PROTOCOL);
  }
};

export const handleProtocols = () => {};

export const setContentSecurityPolicy = () => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          `script-src 'self' http: https: ws: 'unsafe-inline'`
        ]
      }
    });
  });
};
