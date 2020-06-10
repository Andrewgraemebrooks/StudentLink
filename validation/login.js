// Bring in the validator npm module and the isEmpty function.
const validator = require('validator');
const isEmpty = require('./is-empty');

/**
 * Validates the input from the api/users/login route
 * @author Andrew Brooks
 * @param {any} data - The inputted data to be validated
 * @return {Object} errors - The errors object containing the value of the specific error(s)
 * @return {boolean} isValid - A boolean value on whether or not there are errors.
 */
module.exports = function validateLoginInput(data) {
  // Create an errors object to store errors
  let errors = {};

  // Validator can only validate and therefore if the data is empty we set it to an empty string.
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  // Adds an error if the email inputted is not a valid email.
  if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  // Adds an error if the email field is empty.
  if (validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  // Adds an error if the password field is empty.
  if (validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  // Adds an error if the password is not the correct length.
  if (!(validator.isLength(data.password), { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  // Returns the errors object and a boolean variable of whether or not there are any errors.
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
