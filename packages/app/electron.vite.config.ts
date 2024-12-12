import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import path from "path";
import react from "@vitejs/plugin-react";

const externals = ["knex"];

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin({ include: externals })],
    build: {
      outDir: path.join(__dirname, "dist", "main"),
      lib: {
        entry: path.join(__dirname, "src", "main", "index.ts")
      },
      rollupOptions: {
        output: {
          format: "cjs"
        }
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin({ include: externals })],
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
