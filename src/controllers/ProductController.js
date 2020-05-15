const connection = require('../database/connection');

module.exports = {

 // Return all products 
  async index(request, response) {

    const products = await connection('products').select('*');
    
    return response.json(products);
  },
  
  // Create a new product
  async create(request, response) {

    const { name, price } = request.body;
    const qtd = 0;
    await connection('products').insert({

      name,
      price,
      qtd
    });

    return response.status(204).send();
  },
  
  // Updates name and/or price of a product
  async update(request, response) {

    const { id } = request.params;
    const { name, price } = request.body;

    await connection('products').where('id', id).update({

      name,
      price
    });

    return response.status(204).send();
  },
  
  // Delete product
  async delete(request, response) {

    const { id } = request.params;

    await connection('products').where('id', id).delete();
    
    return response.status(204).send();
  },
}