import { app, Rectangle } from "electron";
import fs from "fs/promises";
import path from "path";

export interface StoreState {
  windowStates: Record<string, WindowState>;
}

class Store {
  private getPath = (key: string) =>
    path.join(app.getPath("userData"), `store-${key}.json`);

  get = async <K extends keyof StoreState>(
    key: K
  ): Promise<StoreState[K] | undefined> => {
    try {
      return JSON.parse(await fs.readFile(this.getPath(key), "utf-8"));
    } catch {
      return undefined;
    }
  };

  set = async <K extends keyof StoreState>(key: K, value: StoreState[K]) => {
    return fs
      .writeFile(this.getPath(key), JSON.stringify(value), "utf-8")
      .catch(() => {});
  };

  delete = async <K extends keyof StoreState>(key: K) => {
    return fs.rm(this.getPath(key), { force: true }).catch(() => {});
  };
}

export const store = new Store();

const windowStates: Record<string, WindowState> = {};
export const getWindowState = (id: number): WindowState | undefined => {
  return windowStates[id];
};

export const setWindowState = (id: number, state: WindowState) => {
  windowStates[id] = { ...(windowStates[id] || {}), ...state };
};

export const deleteWindowState = (id: number) => {
  delete windowStates[id];
};

export interface WindowState {
  bounds: Rectangle;
}
