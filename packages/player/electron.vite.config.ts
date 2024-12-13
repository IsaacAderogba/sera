import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin({ include: ["knex", "elevenlabs"] })],
    build: {
      outDir: path.join(__dirname, "dist", "main"),
      lib: {
        entry: path.join(__dirname, "src", "main", "index.ts")
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: path.join(__dirname, "dist", "preload"),
      lib: {
        entry: path.join(__dirname, "src", "preload", "index.ts")
      }
    }
  },
  renderer: {
    root: path.join(__dirname, "src", "renderer"),
    build: {
      outDir: path.join(__dirname, "dist", "renderer"),
      rollupOptions: {
        input: {
          main: path.join(__dirname, "src", "renderer", "main.html"),
          menubar: path.join(__dirname, "src", "renderer", "menubar.html")
        }
      }
    },
    plugins: [react({})]
  }
});
