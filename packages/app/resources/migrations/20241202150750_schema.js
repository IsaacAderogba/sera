/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema
    .createTable("profiles", table => {
      table.increments("id");
      table.enum("type", ["profile"]).defaultTo("profile");
      table.string("token", 512);
      table.json("data").notNullable().defaultTo("{}");

      table.datetime("createdAt").notNullable().defaultTo(knex.fn.now());
      table.datetime("updatedAt").notNullable().defaultTo(knex.fn.now());
    })
    .createTable("playlists", table => {
      table.increments("id");
      table.enum("type", ["playlist"]).defaultTo("playlist");
      table.json("data").notNullable().defaultTo("{}");

      table.datetime("createdAt").notNullable().defaultTo(knex.fn.now());
      table.datetime("updatedAt").notNullable().defaultTo(knex.fn.now());

      // foreign keys
      table.integer("profileId").notNullable();
      table
        .foreign("profileId")
        .references("profiles.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("songs", table => {
      table.increments("id");
      table.enum("type", ["song"]).defaultTo("song");
      table.json("data").notNullable().defaultTo("{}");

      table.datetime("createdAt").notNullable().defaultTo(knex.fn.now());
      table.datetime("updatedAt").notNullable().defaultTo(knex.fn.now());

      // foreign keys
      table.integer("profileId").notNullable();
      table
        .foreign("profileId")
        .references("profiles.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("playlists_songs", table => {
      table.increments("id");
      table.enum("type", ["playlist_song"]).defaultTo("playlist_song");
      table.json("data").notNullable().defaultTo("{}");

      table.datetime("createdAt").notNullable().defaultTo(knex.fn.now());
      table.datetime("updatedAt").notNullable().defaultTo(knex.fn.now());

      // foreign keys
      table.integer("profileId").notNullable();
      table
        .foreign("profileId")
        .references("profiles.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      table.integer("playlistId").notNullable();
      table
        .foreign("playlistId")
        .references("playlists.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      table.integer("songId").notNullable();
      table
        .foreign("songId")
        .references("songs.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema
    .dropTableIfExists("playlists_songs")
    .dropTableIfExists("songs")
    .dropTableIfExists("playlists")
    .dropTableIfExists("profiles");
};
