import { app } from "electron";
import knex, { Knex } from "knex";
import path from "node:path";
import { Adapter, AdaptersInterface, ItemRecord } from "../preload/ipc";
import { RESOURCES_FOLDER } from "./constants";

let database: Knex;
export const connectDatabase = async (table?: string): Promise<Knex> => {
  if (database) return table ? database(table) : database;

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

  return table ? database(table) : database;
};

export const disconnectDatabase = async () => {
  await database.destroy();
};

const createAdapter = <T extends keyof ItemRecord>(
  table: T
): Adapter<ItemRecord[T]> => {
  return {
    read: async id => {
      const database = await connectDatabase(table);
      return database.where({ id }).first();
    },
    list: async () => {
      const database = await connectDatabase(table);
      return database.select("*");
    },
    create: async item => {
      const database = await connectDatabase(table);
      const [id] = await database.insert(item);
      return database.where({ id }).first();
    },
    update: async (id, item) => {
      const database = await connectDatabase(table);
      await database.where({ id }).update(item);
      return database.where({ id }).first();
    },
    delete: async id => {
      const database = await connectDatabase(table);
      await database.where({ id }).delete();
    }
  };
};

export const adapters: AdaptersInterface = {
  profiles: createAdapter("profiles"),
  playlists: createAdapter("playlists"),
  songs: createAdapter("songs"),
  playlists_songs: createAdapter("playlists_songs")
};
