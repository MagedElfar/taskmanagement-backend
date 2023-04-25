import type { Knex } from 'knex'

export const up = function (knex: Knex) {
    return knex.schema
        .createTable("messages", function (table: Knex.TableBuilder) {
            table.increments();

            table.string("content").notNullable();

            table.boolean("is_read").defaultTo(false)

            table.integer("chat_id").unsigned().notNullable();
            table.integer("sender_id").unsigned().nullable();

            table.foreign("chat_id")
                .references("id")
                .inTable("chats")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")

            table.foreign("sender_id")
                .references("id")
                .inTable("users")
                .onUpdate("CASCADE")
                .onDelete("SET NULL")


            table.timestamps(true, true);

        })
        .then(() => console.log("messages table are created"));
};

export const down = function (knex: any) {
    return knex.schema
        .dropTable("messages")
};