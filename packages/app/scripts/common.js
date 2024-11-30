import os from "os";
import dotenv from "dotenv";
import builder from "electron-builder";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", "build", ".env") });

const {
  CSC_LINK,
  CSC_KEY_PASSWORD,
  WIN_CSC_LINK,
  WIN_CSC_KEY_PASSWORD,
  GH_TOKEN
} = process.env;

const Platform = builder.Platform;
const appBundleId = "com.sera.prod";

async function pkg(targets, options) {
  await builder.build({
    targets,
    publish: "never",
    ...options,
    config: {
      appId: appBundleId,
      productName: "Sera",
      directories: { output: "out", buildResources: "public" },
      files: ["dist/**/*", "public/**/*", "package.json"],
      publish: { provider: "github", owner: "IsaacAderogba", repo: "sera" },
      ...options?.config,
      mac: {
        cscLink: CSC_LINK,
        cscKeyPassword: CSC_KEY_PASSWORD,
        category: "public.app-category.productivity",
        icon: path.join(__dirname, "..", "public", "logos", "icon.icns"),
        target: {
          target: "zip",
          arch: ["x64", "arm64"]
        },
        entitlements: path.join(
          __dirname,
          "..",
          "build",
          "entitlements.mac.plist"
        ),
        ...options?.config?.mac
      },
      win: {
        icon: path.join(__dirname, "..", "public", "logos", "icon.ico"),
        cscLink: WIN_CSC_LINK,
        cscKeyPassword: WIN_CSC_KEY_PASSWORD,
        target: {
          target: "nsis",
          arch: ["x64", "arm64"]
        },
        // because setting a publisher isn't possible when using the apple developer cert
        verifyUpdateCodeSignature: false,
        ...options?.config?.win
      },
      linux: {
        category: "Utility",
        icon: path.join(__dirname, "..", "public", "logos", "icon.png"),
        executableName: "Sera",
        target: { target: "AppImage", arch: ["x64", "arm64"] },
        ...options?.config?.linux
      },
      snap: {
        publish: { provider: "generic", url: "https://anydummyurl.com" }
      }
    }
  });
}

async function build(options = {}) {
  // await pkg(Platform.MAC.createTarget(), options);
  // await pkg(Platform.WINDOWS.createTarget(), options);
  // await pkg(Platform.LINUX.createTarget(), options);

  switch (os.platform()) {
    case "darwin":
      console.log(`Packaging mac targets`);
      return await pkg(Platform.MAC.createTarget(), options);
    case "win32":
      console.log(`Packaging win targets`);
      return await pkg(Platform.WINDOWS.createTarget(), options);
    default:
      console.log(`Packaging linux targets`);
      return await pkg(Platform.LINUX.createTarget(), options);
  }
}

export { build, GH_TOKEN };
