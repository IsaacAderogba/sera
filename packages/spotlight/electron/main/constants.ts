import { app } from "electron";
import path from "path";

export const IS_DEVELOPMENT = !app.isPackaged;

export const STAGE = app.isPackaged ? "production" : "development";
export const APP_MODEL_ID = IS_DEVELOPMENT
  ? "com.spotlight.dev"
  : "com.spotlight.prod";

export const ELECTRON_RENDERER_URL = IS_DEVELOPMENT
  ? process.env["ELECTRON_RENDERER_URL"]
  : "";

export const PUBLIC_FOLDER = path.join(__dirname, "..", "..", "public");
export const DEEPLINK_PROTOCOL = IS_DEVELOPMENT ? "spotlight-dev" : "spotlight";
export const SHARED_PARTITION = "persist:shared";

export const { NODE_ENV } = process.env;
