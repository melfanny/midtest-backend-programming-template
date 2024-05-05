const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const { errors } = require('celebrate');
const clientsController = require('./clients-controller');
const clientsValidator = require('./clients-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/clients', route);

  // Get list of users
  route.get('/', authenticationMiddleware, clientsController.getClients);

  // Create user
  route.post(
    '/',
    authenticationMiddleware,
    clientsValidator.createUser,
    clientsController.createClient
  );

  // Get user detail
  route.get('/:id', authenticationMiddleware, clientsController.getClient);

  app.use(errors());
};
