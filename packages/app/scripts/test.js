import { build } from "./common.js";

build({
  publish: "never",
  config: {
    extraMetadata: { version: "0.0.1" },
    mac: {
      target: { target: "zip", arch: ["x64"] }
    },
    win: {
      target: { target: "nsis", arch: ["x64"] }
    },
    linux: {
      target: { target: "AppImage", arch: ["x64"] }
    }
  }
});
