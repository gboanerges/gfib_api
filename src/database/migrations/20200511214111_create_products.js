exports.up = function(knex) {
  
  return knex.schema.createTable('products', function(table){

    table.increments('id').primary();
    table.string('name').notNullable();
    table.decimal('price').notNullable();
    table.decimal('qtd').notNullable();
  });
};

exports.down = function(knex) {
  
  return knex.schema.dropTable('products');
};
