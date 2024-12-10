import { app } from "electron";
import knex, { Knex } from "knex";
import path from "node:path";
import { IPCAdapter, IPCAdaptersInterface, ItemRecord } from "../preload/ipc";
import { RESOURCES_FOLDER } from "./constants";
import { broadcast } from "./broadcast";

let database: Knex | undefined = undefined;
export const connectDatabase = async (table?: string): Promise<Knex> => {
  if (database) return database;

  database = knex({
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: path.join(app.getPath("userData"), "database.sqlite3")
    },
    migrations: {
      directory: path.join(RESOURCES_FOLDER, "migrations")
    }
  });

  try {
    // await database.migrate.rollback({}, true);
    await database.migrate.latest();
  } catch (error) {
    console.error("Migration error", error);
  }

  return table ? database.table(table) : database;
};

export const disconnectDatabase = async () => {
  await database?.destroy();
};

const createIPCAdapter = <T extends keyof ItemRecord>(
  table: T
): IPCAdapter<ItemRecord[T]> => {
  const deserializeItem = (item: any) => ({
    ...item,
    data: JSON.parse(item.data)
  });

  return {
    read: async id => {
      const database = await connectDatabase(table);
      const data = database.table(table).where({ id }).first();
      return data ? deserializeItem(data) : undefined;
    },
    list: async () => {
      const database = await connectDatabase(table);
      const list = database.table(table).select("*");
      return (await list).map(item => deserializeItem(item));
    },
    create: async item => {
      const database = await connectDatabase(table);
      const [id] = await database.table(table).insert({
        ...item,
        data: JSON.stringify(item.data || {}),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const data = await database.table(table).where({ id }).first();
      await broadcast(-1, "change", { action: "created", data });
      return deserializeItem(data);
    },
    update: async (id, item) => {
      const database = await connectDatabase(table);

      const previous = await database.table(table).where({ id }).first();
      await database
        .table(table)
        .where({ id })
        .update({
          ...item,
          data: JSON.stringify({ ...JSON.parse(previous.data), ...item.data }),
          updatedAt: new Date().toISOString()
        });

      const data = await database.table(table).where({ id }).first();
      await broadcast(-1, "change", { action: "updated", data });
      return deserializeItem(data);
    },
    delete: async id => {
      const database = await connectDatabase(table);
      const data = await database.table(table).where({ id }).first();
      if (data) {
        await broadcast(-1, "change", { action: "deleted", data });
        await database.table(table).where({ id }).delete();
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
