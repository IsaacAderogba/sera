import { app, net, protocol, session } from "electron";
import path from "path";

export const handleProtocols = () => {
  protocol.handle("audio", request => {
    const audioFilename = request.url.substring("audio://".length);
    const audioPath = path.join(app.getPath("userData"), audioFilename);
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
