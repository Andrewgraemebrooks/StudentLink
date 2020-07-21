// Bring in the validator npm module and the isEmpty function.
const validator = require('validator');
const isEmpty = require('./isEmpty');

/**
 * Validates the input from the api/users/login route
 * @author Andrew Brooks
 * @param {any} userData - The inputted userData to be validated
 * @return {Object} errors - The errors object containing the value of the specific error(s)
 * @return {boolean} noErrors - A boolean value on whether or not there are errors.
 */
module.exports = function validateLoginInput(userData) {
  // Create an errors object to store errors
  let errors = {};

  // Validator can only validate and therefore if the userData is empty we set it to an empty string.
  userData.email = !isEmpty(userData.email) ? userData.email : '';
  userData.password = !isEmpty(userData.password) ? userData.password : '';

  // Adds an error if the email inputted is not a valid email.
  if (!validator.isEmail(userData.email)) {
    errors.email = 'Email is invalid';
  }

  // Adds an error if the email field is empty.
  if (validator.isEmpty(userData.email)) {
    errors.email = 'Email field is required';
  }

  // Adds an error if the password field is empty.
  if (validator.isEmpty(userData.password)) {
    errors.password = 'Password field is required';
  }

  // Adds an error if the password is not the correct length.
  if (!(validator.isLength(userData.password), { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  // Returns the errors object and a boolean variable of whether or not there are any errors.
  return {
    errors,
    noErrors: isEmpty(errors),
  };
};
