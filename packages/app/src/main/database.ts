import { app } from "electron";
import knex, { Knex } from "knex";
import path from "node:path";
import { IPCAdapter, IPCAdaptersInterface, ItemRecord } from "../preload/ipc";
import { RESOURCES_FOLDER } from "./constants";
import { broadcast } from "./broadcast";

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

const createIPCAdapter = <T extends keyof ItemRecord>(
  table: T
): IPCAdapter<ItemRecord[T]> => {
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
      const [id] = await database.insert({
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const data = await database.where({ id }).first();
      broadcast(-1, "change", { action: "created", data });
      return data;
    },
    update: async (id, item) => {
      const database = await connectDatabase(table);
      await database
        .where({ id })
        .update({ ...item, updatedAt: new Date().toISOString() });

      const data = await database.where({ id }).first();
      broadcast(-1, "change", { action: "updated", data });
      return data;
    },
    delete: async id => {
      const database = await connectDatabase(table);
      const data = await database.where({ id }).first();
      if (data) {
        broadcast(-1, "change", { action: "deleted", data });
        await database.where({ id }).delete();
      }
    }
  };
};

export const adapters: IPCAdaptersInterface = {
  profiles: createIPCAdapter("profiles"),
  playlists: createIPCAdapter("playlists"),
  songs: createIPCAdapter("songs"),
  playlists_songs: createIPCAdapter("playlists_songs")
};
