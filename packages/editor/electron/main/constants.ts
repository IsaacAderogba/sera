import { app } from "electron";
import path from "path";

export const IS_DEVELOPMENT = !app.isPackaged;

export const STAGE = app.isPackaged ? "production" : "development";
export const APP_MODEL_ID = IS_DEVELOPMENT
  ? "com.launcher.dev"
  : "com.launcher.prod";

export const ELECTRON_RENDERER_URL = IS_DEVELOPMENT
  ? process.env["ELECTRON_RENDERER_URL"]
  : "";

export const RESOURCES_FOLDER = path.join(__dirname, "..", "..", "resources");
export const DEEPLINK_PROTOCOL = IS_DEVELOPMENT ? "launcher-dev" : "launcher";

export const { NODE_ENV } = process.env;
