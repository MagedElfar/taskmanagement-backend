import type { Knex } from 'knex'

export const up = function (knex: Knex) {
    return knex.schema
        .createTable("chats", function (table: Knex.TableBuilder) {
            table.increments();

            table.integer("user1_Id").unsigned().nullable();

            table.integer("user2_Id").unsigned().nullable();

            table.foreign("user1_Id")
                .references("id")
                .inTable("users")
                .onUpdate("CASCADE")
                .onDelete("SET NULL")

            table.foreign("user2_Id")
                .references("id")
                .inTable("users")
                .onUpdate("CASCADE")
                .onDelete("SET NULL")

            table.timestamps(true, true);

        })
        .then(() => console.log("chats table are created"));
};

export const down = function (knex: any) {
    return knex.schema
        .dropTable("chats")
};