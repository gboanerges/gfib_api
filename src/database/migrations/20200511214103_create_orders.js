exports.up = function(knex) {
  
  return knex.schema.createTable('orders', function(table){

    table.increments('id').primary();

    table.string('products').notNullable();

    table.decimal('totalValue').notNullable();
    table.decimal('cashValue').notNullable();
    table.decimal('cardValue').notNullable();

    table.string('paymentType').notNullable();
    table.string('paymentMode').notNullable();
    table.integer('client')
      .notNullable()
      .references('id')
      .inTable('clients');
    
    table.timestamp('created_at').notNullable();

  });
};

exports.down = function(knex) {
  
  return knex.schema.dropTable('orders');
};
