import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import path from "path";
import react from "@vitejs/plugin-react";

const externals = ["knex"];

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin({ include: externals })],
    build: {
      outDir: path.join("dist", "main"),
      lib: {
        entry: path.join("src", "main", "index.ts")
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin({ include: externals })],
    build: {
      outDir: path.join("dist", "preload"),
      lib: {
        entry: path.join("src", "preload", "index.ts")
      }
    }
  },
  renderer: {
    root: path.join("src", "renderer"),
    build: {
      outDir: path.join("dist", "renderer"),
      rollupOptions: {
        input: {
          main: path.join("src", "renderer", "main.html"),
          menubar: path.join("src", "renderer", "menubar.html")
        }
      }
    },
    plugins: [react({})]
  }
});
