import { app } from "electron";
import knex, { Knex } from "knex";
import path from "node:path";
import { RESOURCES_FOLDER } from "./constants";
import {
  Adapter,
  AdaptersInterface,
  Item,
  ItemRecord,
  Playlist,
  Song,
  User
} from "../preload/ipc";

let database: Knex;
export const connectDatabase = async (): Promise<Knex> => {
  if (database) return database;

  database = knex({
    client: "sqlite3",
    connection: {
      filename: path.join(app.getPath("userData"), "database.sqlite3")
    },
    migrations: {
      directory: path.join(RESOURCES_FOLDER, "migrations")
    }
  });

  try {
    await database.migrate.latest();
  } catch (error) {
    console.error("Migration error", error);
  }

  return database;
};

export const disconnectDatabase = async () => {
  await database.destroy();
};

const createAdapter = <T extends keyof ItemRecord>(
  type: T
): Adapter<ItemRecord[T]> => {
  return {
    read: () => {
      throw new Error("Unimplemented");
    },
    list: () => {
      throw new Error("Unimplemented");
    },

    create: () => {
      throw new Error("Unimplemented");
    },
    update: () => {
      throw new Error("Unimplemented");
    },
    delete: () => {
      throw new Error("Unimplemented");
    }
  };
};

export const adapters: AdaptersInterface = {
  user: createAdapter("user"),
  playlist: createAdapter("playlist"),
  song: createAdapter("song")
};
