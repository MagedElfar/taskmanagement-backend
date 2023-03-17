import type { Knex } from 'knex'

export const up = function (knex: Knex) {
    return knex.schema
        .createTable("comments", function (table: Knex.TableBuilder) {
            table.increments();
            table.string("comment");
            table.integer("taskId").unsigned().notNullable();
            table.integer("userId").unsigned().notNullable();

            table.foreign("taskId")
                .references("id").
                inTable("tasks")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")

            table.foreign("userId")
                .references("id").
                inTable("users")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")

            table.timestamps(true, true);

        })
        .then(() => console.log("comments table are created"));
};

export const down = function (knex: any) {
    return knex.schema
        .dropTable("comments")
};