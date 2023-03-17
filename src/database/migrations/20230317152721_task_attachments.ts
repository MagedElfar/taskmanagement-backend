import type { Knex } from 'knex'

export const up = function (knex: Knex) {
    return knex.schema
        .createTable("task_attachments", function (table: Knex.TableBuilder) {
            table.increments();
            table.string("url");
            table.string("storage_key");
            table.string("type");
            table.integer("taskId").unsigned().notNullable();
            table.integer("memberId").unsigned().notNullable();

            table.foreign("taskId")
                .references("id").
                inTable("tasks")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")
        })
        .then(() => console.log("task_attachments table are created"));
};

export const down = function (knex: any) {
    return knex.schema
        .dropTable("task_attachments")
};