<<<<<<< Updated upstream
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
=======
// Bring in the validator npm module and the isEmpty function.
const Validator = require('validator');
const isEmpty = require('./is-empty');

/**
 * Validates the input from the api/users/register route
 * @author Andrew Brooks
 * @param {any} data - The variable to check whether or not it is empty.
 * @return {Object} errors - The errors object containing the value of the specific error(s)
 * @return {boolean} isValid - A boolean value on whether or not there are errors.
 */
module.exports = function validateProfileInput(data) {
  // Create an errors object to store errors
>>>>>>> Stashed changes
  let errors = {};

  // Validator can only validate String so if null set to empty string
  data.handle = !isEmpty(data.handle) ? data.handle : '';

<<<<<<< Updated upstream
=======
  // Adds an error if the handle is not the correct length
>>>>>>> Stashed changes
  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle needs to be between 2 and 4 characters';
  }

<<<<<<< Updated upstream
=======
  // Returns the errors object and a boolean variable of whether or not there are any errors.
>>>>>>> Stashed changes
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
