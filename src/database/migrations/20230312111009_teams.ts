import type { Knex } from 'knex'

export const up = function (knex: Knex) {
    return knex.schema
        .createTable("teams", function (table: Knex.TableBuilder) {
            table.increments();
            table.integer("space").unsigned().notNullable();
            table.integer("userId").unsigned().notNullable();
            table.enum("role", ["owner", "admin", "member"]);

            table.foreign("space")
                .references("id").
                inTable("spaces")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")

            table.foreign("userId")
                .references("id").
                inTable("users")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")
            table.timestamps(true, true);
        })
        .then(() => console.log("teams table are created"));
};

export const down = function (knex: any) {
    return knex.schema
        .dropTable("teams")
};