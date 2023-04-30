import type { Knex } from 'knex'

export const up = function (knex: Knex) {
    return knex.schema
        .createTable("message_receivers", function (table: Knex.TableBuilder) {
            table.increments();

            table.boolean("is_read").defaultTo(false)

            table.integer("message_id").unsigned().notNullable();
            table.integer("receiver_id").unsigned().nullable();

            table.foreign("message_id")
                .references("id")
                .inTable("messages")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")

            table.foreign("receiver_id")
                .references("id")
                .inTable("users")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")


            table.timestamps(true, true);

        })
        .then(() => console.log("message_receivers table are created"));
};

export const down = function (knex: any) {
    return knex.schema
        .dropTable("message_receivers")
};