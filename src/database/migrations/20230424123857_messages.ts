import type { Knex } from 'knex'

export const up = function (knex: Knex) {
    return knex.schema
        .createTable("messages", function (table: Knex.TableBuilder) {
            table.increments();

            table.string("content").notNullable();

            table.integer("conversation_id").unsigned().notNullable();
            table.integer("sender_id").unsigned().nullable();

            table.foreign("conversation_id")
                .references("id")
                .inTable("conversations")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")

            table.foreign("sender_id")
                .references("id")
                .inTable("users")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")


            table.timestamps(true, true);

        })
        .then(() => console.log("messages table are created"));
};

export const down = function (knex: any) {
    return knex.schema
        .dropTable("messages")
};