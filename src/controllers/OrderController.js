const knex = require('../database/connection');

module.exports = {

  // Return all orders or specific client orders
  async index(request, response) {
      
    const orders = await knex('orders').select('*');
    return response.json(orders);
  },

   // Return orders from specific client 
   async show(request, response) {

    const { id } = request.params;
    
    const clientOrders = await knex('orders').select('*').where('client', id);
    
    if(clientOrders.length > 0) {

      return response.json(clientOrders);
    }
    
    else {

      return response.json({
        error: 'Id inválido',
        msg: 'Cliente não cadastrado',
      });
    }
  },
  
  // Create a new order, checking the given client
  async create(request, response) {

    const { 
      products,
      totalValue,
      cashValue,
      cardValue,
      client, // Client ID
      paymentMode,
      paymentType,

    } = request.body;
    
    const date = new Date().toLocaleDateString();

    const trx = await knex.transaction();

    await trx('orders').insert({

      products,
      totalValue,
      cashValue,
      cardValue,
      client,
      paymentMode,
      paymentType,
      created_at: date
    });
    
    // Id client > 0, might need update his debt
    if(client != 0){

      const checkClient = await trx('clients').where('id', client).select('*');
      
      // Check if the id is registered
      if (checkClient.length != 0){
        
        // Client paid the total value
        if(paymentType === 'TOTAL') {

          await trx.commit();
          return response.status(204).json({
            msg: "Compra cadastrada com sucesso!"
          });
        }
        
        else if(paymentType === 'DÍVIDA') {

          const debt = checkClient[0].debt - totalValue;

          await trx('clients').where('id', client).update('debt', debt);

          await trx.commit();
          return response.status(204).json({
            msg: "Pagamento de dívida cadastrado com sucesso!"
          });
        }
        /*
          Client didnt pay or paid less/more than total
          Need to alter his debt
        */
        else {
          const receivedValue = totalValue - cashValue + cardValue;

          const debt = checkClient[0]['debt'] + receivedValue;
      
          await trx('clients').where('id', client).update('debt', debt);
          
          await trx.commit();
          return response.status(204).send();
        }
        
      }else {

        return response.json({
          error: 'ID inválido',
          msg: 'Cliente não cadastrado',
        });
      }
    }
    else {

      await trx.commit();
      return response.status(204).json({
        msg: "Compra cadastrada com sucesso!"
      });
    }
  },
  
  // Updates received value of a order 
  async update(request, response) {

    // Order id
    const { id } = request.params;

    const { idClient } = request.body;
    const { value } = request.body;

    const checkClient = await knex('clients').where('id', idClient).select('*');
      
    const debt = checkClient[0]['debt'] - value;
    
    await knex('clients').where('id', idClient).update('debt', debt);

    await knex('orders').where('id', id).update({

      receivedValue: value
    });

    return response.status(204).send();
  },

  async delete(request, response) {

    // Receive id from request 
    const { id } = request.params;
    // Search for the given order
    const data = await knex('orders').where('id', id).select('*');

    const client = data[0]['client'];
    const debt = (data[0]['value'] - data[0]['receivedValue']);

    // Check if isnt a normal client 
    if (client !== "CLIENTE" && debt !== 0) {
      
      return response.json({
        msg: "Não é possivel deletar compra",
        error: "Compra não paga totalmente."
      });
    }

    // Delete order 
    await knex('orders').where('id', id).delete();

    return response.status(204).send();
  },
}