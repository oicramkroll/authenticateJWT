
exports.up = function(knex) {
  return knex.schema.createTable('users',table =>{
    table.increments();
    table.string('name',45).notNullable();
    table.string('email',100).unique().notNullable();
    table.string('password',45).notNullable();
    table.string('password_reset_token',100);
    table.string('password_reset_expiries',100);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
