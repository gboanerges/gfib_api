exports.seed = function (knex, Promise) {

    return knex('clients').insert([
  
      {name: 'Cliente', id: 1, debt: 0},
    ]);
  }