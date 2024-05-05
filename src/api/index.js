const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const clients = require('./components/clients/clients-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  clients(app);

  return app;
};
