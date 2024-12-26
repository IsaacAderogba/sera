import { bundle as bundleRemotion } from "@remotion/bundler";
import path from "path";

export async function bundle() {
  console.log("Bundling Remotion...");

  try {
    const bundleLocation = await bundleRemotion({
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
