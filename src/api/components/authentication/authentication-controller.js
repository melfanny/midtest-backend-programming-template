const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // cek apakah login sudah 5 kali
    const attempts = authenticationServices.manageLoginAttempts(email);
    if (attempts) {
      // jika sudah munculah error 403 terlalu banyak percobaan
      return response.status(403).json({
        error:
          'Wrong email or password Attempt : 5. Limit reached, cobalagi 30 menit berikutnya',
        attempts: attempts.count,
      });
    }
    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      const Attempt = authenticationServices.manageLoginAttempts(email);
      throw errorResponder(
        errorTypes.FORBIDDEN,
        `Wrong email or password Attempt: ${Attempt.count} `
      );
    }

    return response.status(200).json(loginSuccess);
  } catch (error) {
    if (error.message.includes('Too many failed')) {
      return response.status(403).json({ error: error.message, attempts: 5 });
    } else {
      return next(error);
    }
  }
}

module.exports = {
  login,
};
