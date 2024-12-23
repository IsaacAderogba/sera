import { app, protocol, session } from "electron";
import path from "path";
import fs from "fs/promises";
import mime from "mime";
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
      scheme: "video",
      privileges: { bypassCSP: true, stream: true, supportFetchAPI: true }
    },
    {
      scheme: "audio",
      privileges: { bypassCSP: true, stream: true, supportFetchAPI: true }
    }
  ]);
};

export const handleProtocols = (ses = session.defaultSession) => {
  ses.protocol.handle("video", async request => {
    console.log("filename", request.url);
    const filename = request.url.substring("video://".length).split("#")[0];
    const videoPath = path.join(app.getPath("userData"), "video", filename);
    return ses.fetch(`file://${videoPath}`, {
      headers: await getFileHeaders(videoPath)
    });
  });

  ses.protocol.handle("audio", request => {
    const filename = request.url.substring("audio://".length).split("#")[0];
    const audioPath = path.join(app.getPath("userData"), "audio", filename);
    return ses.fetch(`file://${audioPath}`);
  });
};

const getFileHeaders = async (pathname: string): Promise<HeadersInit> => {
  try {
    const headers: HeadersInit = {};

    const contentType = mime.getType(pathname);
    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    const stats = await fs.stat(pathname);
    if (stats.size) {
      headers["Content-Length"] = `${stats.size}`;
    }

    return headers;
  } catch (err) {
    console.log("error retrieving headers", err);
    return {};
  }
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
