import type { Knex } from 'knex'

export const up = function (knex: Knex) {
    return knex.schema
        .createTable("profiles", function (table: Knex.TableBuilder) {
            table.increments();
            table.string("first_name").nullable();
            table.string("last_name").nullable();
            table.string("phone").nullable();
            table.enum("gender", ["male", "female"]).nullable();
            table.integer("userId").unsigned().notNullable();
            table.foreign("userId")
                .references("id").
                inTable("users")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")
            table.timestamps(true, true);
        })
        .then(() => console.log("profiles table are created"));
};

export const down = function (knex: any) {
    return knex.schema
        .dropTable("profiles")
};