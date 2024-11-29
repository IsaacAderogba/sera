import os from "os";
import dotenv from "dotenv";
import builder from "electron-builder";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const { CSC_LINK, CSC_KEY_PASSWORD, WIN_CSC_LINK, WIN_CSC_KEY_PASSWORD } =
  process.env;

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
      mac: {
        cscLink: CSC_LINK,
        cscKeyPassword: CSC_KEY_PASSWORD,
        category: "public.app-category.productivity",
        icon: path.join(__dirname, "..", "public", "logos", "icon.icns"),
        target: {
          target: "zip",
          arch: ["x64", "arm64"]
        }
      },
      win: {
        icon: path.join(__dirname, "..", "public", "logos", "icon.ico"),
        cscLink: WIN_CSC_LINK,
        cscKeyPassword: WIN_CSC_KEY_PASSWORD,
        target: {
          target: "nsis",
          arch: ["x64", "arm64"]
        }
      },
      linux: {
        category: "Utility",
        icon: path.join(__dirname, "..", "public", "logos", "icon.png"),
        executableName: "Pine",
        artifactName: "${productName}-${version}.${ext}",
        target: {
          target: "default",
          arch: ["x64", "arm64"]
        }
      },
      snap: {
        publish: { provider: "generic", url: "https://anydummyurl.com" }
      },
      ...options.config
    }
  });
}

export async function build(options = {}) {
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
