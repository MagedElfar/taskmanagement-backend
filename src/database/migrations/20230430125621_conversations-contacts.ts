import type { Knex } from 'knex'

export const up = function (knex: Knex) {
    return knex.schema
        .createTable("contacts", function (table: Knex.TableBuilder) {
            table.increments();

            table.integer("conversation_id").unsigned().notNullable();

            table.integer("user_Id").unsigned().notNullable();

            table.foreign("conversation_id")
                .references("id")
                .inTable("conversations")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")

            table.foreign("user_Id")
                .references("id")
                .inTable("users")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")

            table.timestamps(true, true);

        })
        .then(() => console.log("chats table are created"));
};

export const down = function (knex: any) {
    return knex.schema
        .dropTable("contacts")
};