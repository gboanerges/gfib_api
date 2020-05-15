exports.up = function(knex) {
  
  return knex.schema.createTable('orders', function(table){

    table.increments('id').primary();

    table.string('products').notNullable();

    table.decimal('value').notNullable();
    table.decimal('receivedValue').notNullable();

    table.string('paymentType').notNullable();
    table.string('client').notNullable();
    
    table.timestamp('created_at').defaultTo(knex.fn.now());

  });
};

exports.down = function(knex) {
  
  return knex.schema.dropTable('orders');
};
