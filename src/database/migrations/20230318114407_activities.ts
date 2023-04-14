import type { Knex } from 'knex'

export const up = function (knex: Knex) {
    return knex.schema
        .createTable("activities", function (table: Knex.TableBuilder) {
            table.increments();
            table.string("activity");
            table.integer("taskId").unsigned().notNullable();
            table.integer("user1_Id").unsigned().nullable();
            table.integer("user2_Id").unsigned().nullable();
            table.enu("type", ["activity", "comment"]).defaultTo("activity")


            table.foreign("taskId")
                .references("id").
                inTable("tasks")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")

            table.foreign("user1_Id")
                .references("id").
                inTable("users")
                .onUpdate("CASCADE")
                .onDelete("SET NULL")

            table.foreign("user2_Id")
                .references("id").
                inTable("users")
                .onUpdate("CASCADE")
                .onDelete("SET NULL")

            table.timestamps(true, true);

        })
        .then(() => console.log("activities table are created"));
};

export const down = function (knex: any) {
    return knex.schema
        .dropTable("activities")
};