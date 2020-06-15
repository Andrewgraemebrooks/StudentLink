// Bring in the validator npm module and the isEmpty function.
const validator = require('validator');
const isEmpty = require('./is-empty');

/**
 * Validates the input from the api/groups route
 * @author Andrew Brooks
 * @param {any} data - The inputted data to be validated
 * @return {Object} errors - The errors object containing the value of the specific error(s)
 * @return {boolean} isValid - A boolean value on whether or not there are errors.
 */
module.exports = function validateGroupInput(data) {
  // Create an errors object to store errors
  let errors = {};

  // Validator can only validate String so if null set to empty string
  data.message = !isEmpty(data.message) ? data.message : '';

  // Message can only be between 0 and 300 characters
  if (!validator.isLength(data.message, { min: 0, max: 300 })) {
    errors.name = 'Message needs to be between 2 and 40 characters';
  }

  // Returns the errors object and a boolean variable of whether or not there are any errors.
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
