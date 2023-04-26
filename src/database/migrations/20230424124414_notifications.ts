import type { Knex } from 'knex'

export const up = function (knex: Knex) {
    return knex.schema
        .createTable("notifications", function (table: Knex.TableBuilder) {
            table.increments();

            table.string("text").notNullable();

            table.boolean("is_read").defaultTo(false);

            table.integer("space_id").unsigned().notNullable();

            table.integer("task_id").unsigned().nullable();

            table.integer("receiver").unsigned().notNullable();

            table.integer("sender").unsigned().notNullable();

            table.foreign("receiver")
                .references("id").
                inTable("users")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")

            table.foreign("sender")
                .references("id").
                inTable("users")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")

            table.foreign("task_id")
                .references("id")
                .inTable("tasks")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")

            table.foreign("space_id")
                .references("id")
                .inTable("chats")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")


            table.timestamps(true, true);

        })
        .then(() => console.log("messages table are created"));
};

export const down = function (knex: any) {
    return knex.schema
        .dropTable("notifications")
};