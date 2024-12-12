import { app, net, protocol, session } from "electron";
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

  protocol.registerSchemesAsPrivileged([
    {
      scheme: "audio",
      privileges: {
        bypassCSP: true,
        stream: true,
        supportFetchAPI: true
      }
    }
  ]);
};

export const handleProtocols = (ses = session.defaultSession) => {
  ses.protocol.handle("audio", request => {
    console.log("handle audio");
    const audioFilename = request.url.substring("audio://".length);
    const audioPath = path.join(app.getPath("userData"), audioFilename);
    console.log("audioPath", audioPath);

    return net.fetch(`file://${audioPath}`, {
      headers: { "content-type": "audio/mpeg" }
    });
  });
};

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
