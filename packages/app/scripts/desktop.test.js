import path from "path";
import os from "os";
import { fileURLToPath } from "url";
import { test, expect, _electron as electron } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("smoke test", async () => {
  const app = await electron.launch({
    executablePath: await getExecutablePath(),
    env: {
      ...process.env,
      NODE_ENV: "test",
      APPIMAGE: path.join(__dirname, "..", "out", "Sera-0.0.1.AppImage")
    }
  });

  const result = await new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error("Timeout")), 120_000);
    app.process().stdout.on("data", data => {
      console.log(`stdout: ${data}`);

      if (data.includes("sera-update-downloaded")) {
        clearTimeout(timeoutId);
        return resolve("sera-update-downloaded");
      }
    });

    app.process().stderr.on("data", error => {
      console.log(`stderr: ${error}`);
    });
  });

  await app.close();
  expect(result).toEqual("sera-update-downloaded");
});

const getExecutablePath = async () => {
  switch (os.platform()) {
    case "darwin":
      return path.join(
        __dirname,
        "..",
        "out",
        "mac",
        "Sera.app",
        "Contents",
        "MacOS",
        "Sera"
      );
    case "win32":
      return path.join(__dirname, "..", "out", "win-unpacked", "Sera.exe");
    default:
      return path.join(__dirname, "..", "out", "linux-unpacked", "Sera");
  }
};
