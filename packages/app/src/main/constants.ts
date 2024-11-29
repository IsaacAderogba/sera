import { app } from "electron";
import path from "path";

export const IS_DEVELOPMENT = !app.isPackaged;

export const STAGE = app.isPackaged ? "production" : "development";
export const APP_MODEL_ID = IS_DEVELOPMENT ? "com.sera.dev" : "com.sera.prod";

export const ELECTRON_RENDERER_URL = IS_DEVELOPMENT
  ? process.env["ELECTRON_RENDERER_URL"]
  : "";

export const PUBLIC_FOLDER = path.join(__dirname, "..", "..", "public");
export const BUILD_FOLDER = path.join(__dirname, "..", "..", "build");
export const { NODE_ENV } = process.env;
