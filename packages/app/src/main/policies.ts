import { session } from "electron";

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
