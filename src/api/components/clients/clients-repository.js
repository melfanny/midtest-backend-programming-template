const { Client } = require('../../../models');

/**
 * Get a list of clients
 * @returns {Promise}
 */
async function getClients() {
  return Client.find({});
}

/**
 * Get client detail
 * @param {string} id - client ID
 * @returns {Promise}
 */
async function getClient(id) {
  return Client.findById(id);
}

/**
 * Create new client
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} pin - Hashed pin
 * @param {string} cardtype - tipe kartu
 * @param {number} cardnumber - nomor kartu
 * @returns {Promise}
 */
async function createClient(name, email, pin, cardtype, cardnumber) {
  return Client.create({
    name,
    email,
    pin,
    cardtype,
    cardnumber,
  });
}

/**
 * Get client by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getClientByEmail(email) {
  return Client.findOne({ email });
}

/**
 * Update existing client
 * @param {string} id - client ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateClient(id, name, email) {
  return Client.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a client
 * @param {string} id - client ID
 * @returns {Promise}
 */
async function deleteClient(id) {
  return Client.deleteOne({ _id: id });
}

module.exports = {
  getClients,
  getClient,
  createClient,
  getClientByEmail,
  updateClient,
  deleteClient,
};
