const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const { errors } = require('celebrate');
const clientsController = require('./clients-controller');
const clientsValidator = require('./clients-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/clients', route);

  // Get list of client
  route.get('/', authenticationMiddleware, clientsController.getClients);

  // Create client
  route.post(
    '/',
    authenticationMiddleware,
    clientsValidator.createClient,
    clientsController.createClient
  );

  // Get client detail
  route.get('/:id', authenticationMiddleware, clientsController.getClient);

  // Update client
  route.put(
    '/:id',
    authenticationMiddleware,
    clientsValidator.updateClient,
    clientsController.updateClient
  );

  // Delete client
  route.delete(
    '/:id',
    authenticationMiddleware,
    clientsController.deleteClient
  );

  app.use(errors());
};
