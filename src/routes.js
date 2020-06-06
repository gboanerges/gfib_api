const express = require('express');

const OrderController = require('./controllers/OrderController');

const ClientController = require('./controllers/ClientController');

const ProductController = require('./controllers/ProductController');

const routes = express.Router();

routes.get('/orders', OrderController.index);
routes.get('/orders/:id', OrderController.show);
routes.post('/orders', OrderController.create);
routes.delete('/orders/:id', OrderController.delete);
routes.put('/orders/:id', OrderController.update);

routes.get('/clients', ClientController.index);
routes.post('/clients', ClientController.create);
routes.delete('/clients/:id', ClientController.delete);
routes.put('/clients/:id', ClientController.update);
routes.post('/clients/:name', ClientController.debt);

routes.get('/products', ProductController.index);
routes.post('/products', ProductController.create);
routes.delete('/products/:id', ProductController.delete);
routes.put('/products/:id', ProductController.update);


module.exports = routes;