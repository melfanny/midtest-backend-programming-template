const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');

const loginAttempts = {};

/**
 * Check manage login attempt
 * @param {string} email - Email
 * @param {boolean} Reset - Reset locktime
 * @returns {object}
 */
function manageLoginAttempts(email, reset = false) {
  const maxAttempts = 5;
  const lockoutTime = 30 * 60 * 1000; // 30 minutes

  if (reset) {
    // reset jika sudah berhasil login dengan bener
    if (loginAttempts[email]) {
      clearTimeout(loginAttempts[email].timer);
      delete loginAttempts[email];
    }
    return;
  }

  // menghitung kegagalan login
  if (!loginAttempts[email]) {
    loginAttempts[email] = {
      count: 1,
      timer: setTimeout(() => delete loginAttempts[email], lockoutTime),
    };
  } else {
    loginAttempts[email].count++;
  }

  return loginAttempts[email].count >= maxAttempts;
}

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  if (user && passwordChecked) {
    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  }

  return null;
}

//menambahkan module manageLoginAttempts
module.exports = {
  checkLoginCredentials,
  manageLoginAttempts,
};
