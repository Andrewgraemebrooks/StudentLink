// Bring in the validator npm module and the isEmpty function.
const validator = require('validator');
const isEmpty = require('./isEmpty');

/**
 * Validates the input from the api/groups route
 * @author Andrew Brooks
 * @param {any} userData - The inputted userData to be validated
 * @return {Object} errors - The errors object containing the value of the specific error(s)
 * @return {boolean} noErrors - A boolean value on whether or not there are errors.
 */
module.exports = function validateGroupInput(userData) {
  // Create an errors object to store errors
  let errors = {};

  // Validator can only validate String so if null set to empty string
  userData.message = !isEmpty(userData.message) ? userData.message : '';

  // Message can only be between 0 and 300 characters
  if (!validator.isLength(userData.message, { min: 0, max: 300 })) {
    errors.message = 'Message needs to be between 2 and 40 characters';
  }

  // Returns the errors object and a boolean variable of whether or not there are any errors.
  return {
    errors,
    noErrors: isEmpty(errors),
  };
};
