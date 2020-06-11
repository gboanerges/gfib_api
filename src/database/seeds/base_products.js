exports.seed = function (knex, Promise) {

  return knex('products').insert([

    {name: 'Coxinha', price: 3.5, qtd: 0},
    {name: 'Croquete', price: 3.5, qtd: 0},

    {name: 'Empada Frango', price: 3.5, qtd: 0},
    {name: 'Empada Bacalhau', price: 4, qtd: 0},
    {name: 'Esfiha Carne', price: 3.5, qtd: 0},
    {name: 'Esfiha Frango', price: 3.5, qtd: 0},

    {name: 'Pãozinho', price: 2.5, qtd: 0},
    {name: 'Pastel Forno', price: 3.5, qtd: 0},
    {name: 'Pastel Frito', price: 3, qtd: 0},

    {name: 'Quibe', price: 3.5, qtd: 0},

    {name: 'Risole', price: 3.5, qtd: 0},

    {name: 'Saltenha', price: 3.5, qtd: 0},
   
    {name: 'Tortalete', price: 2.5, qtd: 0},
    {name: 'Torta Doce', price: 3.5, qtd: 0},
    {name: 'Torta Salgada', price: 4, qtd: 0},

    {name: 'Refris', price: 3, qtd: 0},
    {name: 'Refri Coca', price: 3.5, qtd: 0},
    {name: 'Água Mineral', price: 2, qtd: 0},
    {name: 'Suco', price: 2.5, qtd: 0},
  ]);
}