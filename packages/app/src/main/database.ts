import { app } from "electron";
import knex, { Knex } from "knex";
import path from "node:path";
import { RESOURCES_FOLDER } from "./constants";

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
