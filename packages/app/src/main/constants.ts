import { app } from "electron";
import path from "path";

export const IS_DEVELOPMENT = !app.isPackaged;
export const APP_MODEL_ID = IS_DEVELOPMENT ? "com.sera.dev" : "com.sera.prod";

export const ELECTRON_RENDERER_URL = IS_DEVELOPMENT
  ? process.env["ELECTRON_RENDERER_URL"]
  : "";

export const PUBLIC_FOLDER = path.join(__dirname, "..", "..", "public");
