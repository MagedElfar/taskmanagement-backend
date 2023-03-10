import type { Knex } from 'knex'

export const up = function (knex: Knex) {
    return knex.schema
        .createTable("refresh_tokens_list", function (table: Knex.TableBuilder) {
            table.increments();
            table.string("token", 2500);
            table.integer("user").unsigned().notNullable();
            table.foreign("user")
                .references("id").
                inTable("users")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")
            table.timestamps(true, true);
        })
        .then(() => console.log("refresh_tokens_list table are created"));
};

export const down = function (knex: any) {
    return knex.schema
        .dropTable("refresh_tokens_list")
};