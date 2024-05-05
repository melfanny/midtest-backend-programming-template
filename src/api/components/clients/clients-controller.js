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
 * Handle create client request
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
        'Failed to create client'
      );
    }

    return response.status(200).json({ name, email, cardtype, cardnumber });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update client request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateClient(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    // Email must be unique
    const emailIsRegistered = await clientsService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await clientsService.updateClient(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update client'
      );
    }

    return response
      .status(200)
      .json({ id, name, email, message: 'client telah terupdate' });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete client request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteClient(request, response, next) {
  try {
    const id = request.params.id;

    const success = await clientsService.deleteClient(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete client'
      );
    }

    return response.status(200).json({ id, message: 'client telah terhapus' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
};
