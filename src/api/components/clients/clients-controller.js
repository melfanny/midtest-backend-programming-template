const clientsService = require('./clients-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of clients request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getClients(request, response, next) {
  try {
    const clients = await clientsService.getClients();
    return response.status(200).json(clients);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get client detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getClient(request, response, next) {
  try {
    const client = await clientsService.getClient(request.params.id);

    if (!client) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown client');
    }

    return response.status(200).json(client);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createClient(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const pin = request.body.pin;
    const cardtype = request.body.cardtype;
    const cardnumber = request.body.cardnumber;

    // Email must be unique
    const emailIsRegistered = await clientsService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await clientsService.createClient(
      name,
      email,
      pin,
      cardtype,
      cardnumber
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(200).json({ name, email, cardtype, cardnumber });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getClients,
  getClient,
  createClient,
};
