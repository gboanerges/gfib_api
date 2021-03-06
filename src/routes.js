const express = require('express');

const OrderController = require('./controllers/OrderController');

const ClientController = require('./controllers/ClientController');

const ProductController = require('./controllers/ProductController');

const routes = express.Router();

routes.get('/orders/:id', OrderController.showClientOrders);
routes.get('/orders', OrderController.showReportOrders);
routes.post('/orders', OrderController.create);
routes.delete('/orders/:id', OrderController.delete);
routes.put('/orders/:id', OrderController.update);

routes.get('/clients', ClientController.index);
routes.get('/clients/:id', ClientController.show);
routes.post('/clients', ClientController.create);
routes.delete('/clients/:id', ClientController.delete);
routes.put('/clients/:id', ClientController.update);

routes.get('/products', ProductController.index);
routes.post('/products', ProductController.create);
routes.delete('/products/:id', ProductController.delete);
routes.put('/products/:id', ProductController.update);


module.exports = routes;