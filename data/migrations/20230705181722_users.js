/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (tbl) => {
      tbl.increments("user_id");
      tbl.string("username").unique();
      tbl.string("password");
      tbl.integer("permission");
    })
    .createTable("tokens", (tbl) => {
      tbl.increments("token_id");
      tbl.string("token").unique();
      tbl.integer("user_id").unsigned().notNullable().references("user_id").inTable("users").onDelete("CASCADE").onUpdate("CASCADE");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("tokens").dropTableIfExists("users");
};
