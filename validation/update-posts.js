// Bring in the validator npm module and the isEmpty function.
const validator = require('validator');
const isEmpty = require('./isEmpty');

/**
 * Validates the input from the api/users/register route
 * @author Andrew Brooks
 * @param {any} userData - The inputted userData to be validated
 * @return {Object} errors - The errors object containing the value of the specific error(s)
 * @return {boolean} noErrors - A boolean value on whether or not there are errors.
 */
module.exports = function validatePostInput(userData) {
  // Create an errors object to store errors
  let errors = {};

  // validator can only validate String
  userData.text = !isEmpty(userData.text) ? userData.text : '';

  // Add an error if the text is not the right length
  if (
    !validator.isEmpty(userData.text) &&
    !validator.isLength(userData.text, { min: 10, max: 300 })
  ) {
    errors.text = 'Text must be between 10 and characters';
  }

  // Returns the errors object and a boolean variable of whether or not there are any errors.
  return {
    errors,
    noErrors: isEmpty(errors),
  };
};
