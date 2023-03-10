import type { Knex } from 'knex'

export const up = function (knex: Knex) {
    return knex.schema
        .createTable("profiles_images", function (table: Knex.TableBuilder) {
            table.increments();
            table.string("image_url");
            table.string("storage_key");
            table.integer("userId").unsigned().notNullable();
            table.foreign("userId")
                .references("id").
                inTable("users")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")
            table.timestamps(true, true);
        })
        .then(() => console.log("profiles_images table are created"));
};

export const down = function (knex: any) {
    return knex.schema
        .dropTable("profiles_images")
};