import type { Knex } from 'knex'

export const up = function (knex: Knex) {
    return knex.schema
        .createTable("tasks", function (table: Knex.TableBuilder) {
            table.increments();
            table.string("title").notNullable();
            table.string("description").nullable();
            table.enu("status", ["to do", "in progress", "in review", "done", "blocked"])
                .defaultTo("to do");
            table.boolean("is_complete").defaultTo(false)
            table.enu("priority", ["low", "medium", "heigh"]).defaultTo("low")
            table.date("due_date").nullable();


            table.integer("spaceId").unsigned().notNullable();
            table.integer("userId").unsigned().notNullable();
            table.integer("parentId").unsigned().nullable();
            table.integer("projectId").unsigned().nullable();
            table.integer("position").unsigned().nullable();


            table.foreign("spaceId")
                .references("id").
                inTable("spaces")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")

            table.foreign("userId")
                .references("id").
                inTable("users")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")

            table.foreign("projectId")
                .references("id").
                inTable("projects")
                .onUpdate("CASCADE")
                .onDelete("SET NULL")

            table.foreign("parentId")
                .references("id").
                inTable("tasks")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")


            table.timestamps(true, true);
        })
        .then(() => console.log("tasks table are created"));
};

export const down = function (knex: any) {
    return knex.schema
        .dropTable("tasks")
};