const connection = require('../database/connection');

module.exports = {

  // Return all orders or specific client orders
  async index(request, response) {
      
    const orders = await connection('orders').select('*');
    return response.json(orders);
  },

   // Return orders from specific client 
   async show(request, response) {

    const { id } = request.params;
    
    const clientName = await connection('clients').where('id', id).select('name');
    
    if (clientName.length != 0){

      const clientOrders = await connection('orders').select('*').where('client', clientName[0].name);
      return response.json(clientOrders);

    }else {
      return response.json({
        error: 'Id inválido',
        msg: 'Cliente não cadastrado',
      });
    }
  },
  
  // Create a new order, checking the given client
  async create(request, response) {

    const { products, value, receivedValue, client, paymentType } = request.body;
    
    await connection('orders').insert({

      products,
      value,
      receivedValue,
      client,
      paymentType
    });
    
    const name = client.toUpperCase();
    const result = (value - receivedValue);

    if( name !== 'CLIENTE' && paymentType === 'FIADO'){

      // Check value of result, equals to 0 there is no need to be FIADO
      if (result === 0) {

        return response.json({
          msg: 'Valor da compra recebido TOTALMENTE.',
          error: 'Tipo de pagamento incompatível.'});
      }
      
      const checkClient = await connection('clients').where('name', name).select('*');
      
      if (checkClient.length != 0){
      
        const debt = checkClient[0]['debt'] + result;
        
        await connection('clients').where('name', name).update('debt', debt);
        return response.status(204).send();

      }else {

        return response.json({
          error: 'Nome inválido',
          msg: 'Cliente não cadastrado',
        });
      }
    }
  },
  
  // Updates received value of a order 
  async update(request, response) {

    // Order id
    const { id } = request.params;

    const { idClient } = request.body;
    const { value } = request.body;

    const checkClient = await connection('clients').where('id', idClient).select('*');
      
    const debt = checkClient[0]['debt'] - value;
    
    await connection('clients').where('id', idClient).update('debt', debt);

    await connection('orders').where('id', id).update({

      receivedValue: value
    });

    return response.status(204).send();
  },

  async delete(request, response) {

    // Receive id from request 
    const { id } = request.params;
    // Search for the given order
    const data = await connection('orders').where('id', id).select('*');

    const client = data[0]['client'];
    const debt = (data[0]['value'] - data[0]['receivedValue']);

    // Check if isnt a normal client 
    if (client !== "CLIENTE" && debt !== 0) {
      
      console.log(client);

      return response.json({
        msg: "Não é possivel deletar compra",
        error: "Compra não paga totalmente."
      });
    }

    // Delete order 
    await connection('orders').where('id', id).delete();

    return response.status(204).send();
  },
}