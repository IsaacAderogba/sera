/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema
    .createTable("profiles", table => {
      table.increments("id");

      table.string("token", 512);
      table.datetime("createdAt").notNullable().defaultTo(knex.fn.now());
      table.datetime("updatedAt").notNullable().defaultTo(knex.fn.now());
    })
    .createTable("playlists", table => {
      table.increments("id");

      table.integer("profileId").notNullable();
      table.datetime("createdAt").notNullable().defaultTo(knex.fn.now());
      table.datetime("updatedAt").notNullable().defaultTo(knex.fn.now());

      // foreign keys
      table
        .foreign("profileId")
        .references("profiles.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("songs", table => {
      table.increments("id");

      table.integer("profileId").notNullable();
      table.datetime("createdAt").notNullable().defaultTo(knex.fn.now());
      table.datetime("updatedAt").notNullable().defaultTo(knex.fn.now());

      // foreign keys
      table
        .foreign("profileId")
        .references("profiles.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("playlists_songs", table => {
      table.increments("id");

      table.integer("profileId").notNullable();
      table.integer("playlistId").notNullable();
      table.integer("songId").notNullable();
      table.datetime("createdAt").notNullable().defaultTo(knex.fn.now());
      table.datetime("updatedAt").notNullable().defaultTo(knex.fn.now());

      // foreign keys
      table
        .foreign("profileId")
        .references("profiles.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .foreign("playlistId")
        .references("playlists.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
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
