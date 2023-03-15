import type { Knex } from 'knex'

export const up = function (knex: Knex) {
    return knex.schema
        .createTable("projects", function (table: Knex.TableBuilder) {
            table.increments();
            table.string("name").notNullable();
            table.integer("spaceId").unsigned().notNullable();
            table.integer("userId").unsigned().notNullable();

            table.foreign("spaceId")
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
        .then(() => console.log("project table are created"));
};

export const down = function (knex: any) {
    return knex.schema
        .dropTable("projects")
};