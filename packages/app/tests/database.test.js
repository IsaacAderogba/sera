import { expect, test } from "@playwright/test";
import knex from "knex";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectDatabase = () => {
  return knex({
    client: "sqlite3",
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, "..", "resources", "migrations")
    },
    connection: {
      filename: path.join(__dirname, "database.db3")
    }
  });
};

test.beforeAll(async () => {
  const database = connectDatabase();
  await database.migrate.latest();
});

test.beforeEach(async () => {
  const database = connectDatabase();
  await database.table("profiles").del();
  await database.table("playlists").del();
  await database.table("songs").del();
  await database.table("playlists_songs").del();
});

test("creates a profile", async () => {
  const database = connectDatabase();
  const [id] = await database.table("profiles").insert({ token: "foobar" });

  const profile = await database.table("profiles").where({ id }).first();
  expect(profile.token).toEqual("foobar");
});

test("deletes a profile", async () => {
  const database = connectDatabase();
  const [id] = await database.table("profiles").insert({ token: "foobar" });

  await database.table("profiles").where({ id }).delete();
  const profile = await database.table("profiles").where({ id }).first();
  expect(profile).toEqual(undefined);
});

test("creates a profile, playlist, song, and playlist song", async () => {
  const database = connectDatabase();
  const [profileId] = await database
    .table("profiles")
    .insert({ token: "foobar" });

  const [playlistId] = await database.table("playlists").insert({ profileId });
  const [songId] = await database.table("songs").insert({ profileId });
  const [playlistSongId] = await database
    .table("playlists_songs")
    .insert({ profileId, playlistId, songId });

  const playlistSong = await database
    .table("playlists_songs")
    .where({ id: playlistSongId })
    .first();

  expect(playlistSong).toMatchObject({ profileId, playlistId, songId });
});

test("cascade deletes playlist, song, and playlist song", async () => {
  const database = connectDatabase();
  const [profileId] = await database
    .table("profiles")
    .insert({ token: "foobar" });

  const [playlistId] = await database.table("playlists").insert({ profileId });
  const [songId] = await database.table("songs").insert({ profileId });
  await database
    .table("playlists_songs")
    .insert({ profileId, playlistId, songId });

  const [result] = await database.table("playlists_songs").count("id as COUNT");
  expect(result).toEqual({ COUNT: 1 });

  await database.table("profiles").where({ id: profileId }).delete();
  const [result2] = await database
    .table("playlists_songs")
    .count("id as COUNT");
  expect(result2).toEqual({ COUNT: 1 });
});

test.afterAll(async () => {
  const database = connectDatabase();
  await database.migrate.rollback({}, true);
});
