exports.up = function(knex) {
  
  return knex.schema.createTable('clients', function(table){

    table.increments('id').primary();
    table.string('name').notNullable();
    table.decimal('debt').notNullable();
  });
};

exports.down = function(knex) {
  
  return knex.schema.dropTable('clients');
};
