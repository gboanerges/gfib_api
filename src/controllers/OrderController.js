const connection = require('../database/connection');

module.exports = {

  // Return all orders 
  async index(request, response) {

    const orders = await connection('orders').select('*');
    
    return response.json(orders);
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
    const debt = (value - receivedValue);

    if( name !== 'CLIENTE' && paymentType === 'FIADO'){

      // Check value of debt, equals to 0 there is no need to be FIADO
      if (debt === 0) {

        return response.json({
          msg: 'Valor da compra recebido TOTALMENTE.',
          error: 'Tipo de pagamento incompatível.'});
      }

       await connection('clients').insert({

         name,
         debt
       });
    }

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