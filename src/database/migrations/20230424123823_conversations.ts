import type { Knex } from 'knex'

export const up = function (knex: Knex) {
    return knex.schema
        .createTable("conversations", function (table: Knex.TableBuilder) {
            table.increments();

            table.enum("type", ["private", "group"]).defaultTo("private");

            table.integer("space_id").unsigned().nullable();

            table.foreign("space_id")
                .references("id")
                .inTable("spaces")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")

            table.timestamps(true, true);

        })
        .then(() => console.log("chats table are created"));
};

export const down = function (knex: any) {
    return knex.schema
        .dropTable("conversations")
};