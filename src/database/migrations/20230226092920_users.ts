import type { Knex } from 'knex'

export const up = function (knex: Knex) {
    return knex.schema
        .createTable("users", function (table: Knex.TableBuilder) {
            table.increments();
            table.string("username").unique().notNullable();
            table.string("email").unique().notNullable();
            table.string("password").notNullable();
            table.boolean("id_verified").defaultTo(false)
            table.timestamps(true, true);
        })
        .then(() => console.log("user table are created"));
};

export const down = function (knex: any) {
    return knex.schema
        .dropTable("users")
};