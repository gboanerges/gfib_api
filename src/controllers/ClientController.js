const connection = require('../database/connection');

module.exports = {

  // List all clients
  async index(request, response) {
    
    const clients = await connection('clients').select('*');
    
    return response.json(clients);
  },

  // List specific client by id
  async show(request, response) {
    
    const { id } = request.params;

    const client = await connection('clients').where('id', id).select('*');
    
    if(client.length > 0) {

      return response.json(client);
    }
    
    else {

      return response.json({
        error: 'Id inválido',
        msg: 'Cliente não cadastrado',
      });
    }
  },

  async create(request, response) {

    const { clientName } = request.body;
    const name = clientName.toUpperCase();

    const debt = 0;

    await connection('clients').insert({

      name,
      debt
    });

    return response.status(201).send();
  },
  
  // Updates only name of a client
  async update(request, response) {

    const { id } = request.params;
    const { name, debt } = request.body;

    if (name != '' && debt == '') {

      await connection('clients').where('id', id).update({

        name,
      });
      
      return response.status(201).send({

        msg: 'Client name updated.'
      });

    } else if (name == '' && debt != '') {

      
      const checkClient = await connection('clients').where('id', id).select('*');

      const newDebt = checkClient[0]['debt'] + debt;

      // await connection('clients').where('id', id).update({

      //   debt: newDebt,
      // });
      
      return response.status(201).send({

        msg: 'Debt updated.'
      });

    } else {

      return response.status(400).send();
    }
   

  },
  
  // Delete a client without debt
  async delete(request, response) {
    
    // Receive id from request 
    const { id } = request.params;
    // Search for the given client
    const data = await connection('clients').where('id', id).select('*');

    const client = data[0]['name'];
    const debt = data[0]['debt'];

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
}