import { bundle } from "@remotion/bundler";
import path from "path";

async function bundleRemotion() {
  console.log("Bundling Remotion...");

  try {
    const bundleLocation = await bundle({
      entryPoint: path.resolve("src", "remotion", "index.ts"),
      outDir: path.resolve("out", "remotion-bundle"),
      webpackOverride: config => {
        if (config.output) {
          config.output.chunkFormat = "commonjs";
        }

        return config;
      }
    });

    console.log("Bundle location:", bundleLocation);
  } catch (err) {
    console.log("Failed to bundle Remotion:", err);
  }
}

bundleRemotion();
