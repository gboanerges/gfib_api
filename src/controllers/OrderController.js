const knex = require('../database/connection');

module.exports = {

   // Return orders from specific client 
   async showClientOrders(request, response) {

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

  // Return orders from specific date or month, return dates with orders 
   async showReportOrders(request, response) {

    const { date } = request.query;
    const { month } = request.query;

    if (date.length > 0 && month.length == 0 ) {

        const dateOrders = await knex('orders')
          .where('created_at', date)
          .innerJoin('clients', 'orders.client', '=', 'clients.id')
          .select('orders.products',
          'orders.totalValue',
          'orders.cashValue',
          'orders.cardValue',
          'orders.paymentType',
          'orders.paymentMode', 
          'orders.created_at', 
          'clients.name');
                                
      if(dateOrders.length > 0) {

        return response.json(dateOrders);
      }
      
      else {

        return response.json({
          error: 'Data inválida',
          msg: 'Não há compras neste dia.',
        });
      }
    } else if (month.length > 0  && date.length == 0 ) {
      
      const monthOrders = await knex('orders')
        .innerJoin('clients', 'orders.client', '=', 'clients.id')
        .where('created_at', 'like', `%/${month}`)
        .select('orders.products',
        'orders.totalValue',
        'orders.cashValue',
        'orders.cardValue',
        'orders.paymentType',
        'orders.paymentMode', 
        'orders.created_at', 
        'clients.name');

      if(monthOrders.length > 0) {

        return response.json(monthOrders);
      }
      
      else {

        return response.json({
          error: 'Mês sem compras',
          msg: 'Não há compras neste mês.',
        });
      }
    } else {

      const dates = await knex('orders').select('created_at').distinct();
      return response.json(dates);
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
    
    const date = new Date();
    const day = date.toLocaleDateString('pt',{
      day: '2-digit'
    });
    const month = date.toLocaleDateString('pt',{
      month: '2-digit'
    });
    const year = date.toLocaleDateString('pt',{
      year: 'numeric'
    });
    const fullDate = day + '/' + month + '/' + year;

    const trx = await knex.transaction();

    await trx('orders').insert({

      products,
      totalValue,
      cashValue,
      cardValue,
      client,
      paymentMode,
      paymentType,
      created_at: fullDate
    });
    
    // Id client > 0, might need update his debt
    if(client > 1){

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
          Client didn't pay or paid less/more than total
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

    // Check if isn't a normal client 
    if (client !== "CLIENTE" && debt !== 0) {
      
      return response.json({
        msg: "Não é possível deletar compra",
        error: "Compra não paga totalmente."
      });
    }

    // Delete order 
    await knex('orders').where('id', id).delete();

    return response.status(204).send();
  },
}