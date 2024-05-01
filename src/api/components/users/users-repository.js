const { User } = require('../../../models');

/**
 * Get a list of users with paginat, sort, and search
 * @param {number} page - page
 * @param {number} limit - page size
 * @param {string} sort - sort
 * @param {string} search -search
 * @returns {Promise}
 */
async function getUsers({ page, limit, sort, search }) {
  const query = User.find(search);
  const total = await User.countDocuments(search);
  const data = await query
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();

  return {
    page_number: page,
    page_size: limit,
    total_pages: Math.ceil(total / limit),
    has_previous_page: page > 1,
    has_next_page: page < Math.ceil(total / limit),
    data,
  };
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
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
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};
