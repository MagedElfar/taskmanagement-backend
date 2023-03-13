import type { Knex } from 'knex'

export const up = function (knex: Knex) {
    return knex.schema
        .createTable("spaces", function (table: Knex.TableBuilder) {
            table.increments();
            table.string("name").notNullable();
            table.integer("owner").unsigned().notNullable();
            table.foreign("owner")
                .references("id").
                inTable("users")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")
            table.timestamps(true, true);
        })
        .then(() => console.log("spaces table are created"));
};

export const down = function (knex: any) {
    return knex.schema
        .dropTable("spaces")
};