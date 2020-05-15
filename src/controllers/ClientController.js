const connection = require('../database/connection');

module.exports = {

  // List all clients
  async index(request, response) {
    
    const clients = await connection('clients').select('*');
    
    return response.json(clients);
  },
  
  async create(request, response) {

    const { clientName } = request.body;

    const name = clientName.toUpperCase();

    const debt = 0;

    await connection('clients').insert({

      name,
      debt
    });

    return response.status(204).send();
  },
  
  // Updates only name of a client
  async update(request, response) {

    const { id } = request.params;
    const { name } = request.body;

    await connection('clients').where('id', id).update({

      name,
    });

    return response.status(204).send();
  },
  
  // Delete a client without debt
  async delete(request, response) {
    
    // Receive id from request 
    const { id } = request.params;
    // Search for the given client
    const data = await connection('clients').where('id', id).select('*');

    const client = data[0]['name'];
    const debt = data[0]['debt'];

    console.log(client, debt);
    
    if (debt !== 0) {

      return response.json({
        msg: "Não é possivel excluir cliente.",
        error: "Débito diferente de ZERO."
      });
    }

    // Delete order 
    await connection('clients').where('id', id).delete();

    return response.status(204).send();
  },

  // List all unpaid purchases of a single client
  async debt(request, response) {

    // Name of client
    const { name } = request.params;

    // Search all purchases made by the given client
    const clientPurchases = await connection('orders').where('client', name).select('*');
    
    return response.json(clientPurchases);
  },
}