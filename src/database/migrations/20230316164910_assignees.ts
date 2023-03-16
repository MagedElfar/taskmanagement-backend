import type { Knex } from 'knex'

export const up = function (knex: Knex) {
    return knex.schema
        .createTable("assignees", function (table: Knex.TableBuilder) {
            table.increments();
            table.integer("taskId").unsigned().notNullable();
            table.integer("memberId").unsigned().notNullable();

            table.foreign("taskId")
                .references("id").
                inTable("tasks")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")

            table.foreign("memberId")
                .references("id").
                inTable("teams")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")
            table.timestamps(true, true);
        })
        .then(() => console.log("assignees table are created"));
};

export const down = function (knex: any) {
    return knex.schema
        .dropTable("assignees")
};