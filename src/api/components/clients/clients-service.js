const clientsRepository = require('./clients-repository');
const { hashpin } = require('../../../utils/password');
/**
 * Get list of clients
 * @returns {Array}
 */
async function getClients() {
  const clients = await clientsRepository.getClients();

  const results = [];
  for (let i = 0; i < clients.length; i += 1) {
    const client = clients[i];
    results.push({
      id: client.id,
      name: client.name,
      email: client.email,
      cardtype: client.cardtype,
      cardnumber: client.cardnumber,
    });
  }

  return results;
}

/**
 * Get client detail
 * @param {string} id - client ID
 * @returns {Object}
 */
async function getClient(id) {
  const client = await clientsRepository.getClient(id);

  // client not found
  if (!client) {
    return null;
  }

  return {
    id: client.id,
    name: client.name,
    email: client.email,
    cardtype: client.cardtype,
    cardnumber: client.cardnumber,
  };
}

/**
 * Create new client
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} pin - Hashed pin
 * @param {string} cardtype - tipe kartu
 * @param {number} cardnumber - nomor kartu
 * @returns {boolean}
 */
async function createClient(name, email, pin, cardtype, cardnumber) {
  // Hash pin
  const hashedpin = await hashpin(pin);

  try {
    await clientsRepository.createClient(
      name,
      email,
      hashedpin,
      cardtype,
      cardnumber
    );
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const client = await clientsRepository.getClientByEmail(email);

  if (client) {
    return true;
  }

  return false;
}

/**
 * Update existing client
 * @param {string} id - client ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateClient(id, name, email) {
  const client = await clientsRepository.getClient(id);

  // client not found
  if (!client) {
    return null;
  }

  try {
    await clientsRepository.updateClient(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete client
 * @param {string} id - client ID
 * @returns {boolean}
 */
async function deleteClient(id) {
  const client = await clientsRepository.getClient(id);

  // client not found
  if (!client) {
    return null;
  }

  try {
    await clientsRepository.deleteClient(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getClients,
  getClient,
  createClient,
  emailIsRegistered,
  updateClient,
  deleteClient,
};
