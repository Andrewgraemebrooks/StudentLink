// Bring in the validator npm module and the isEmpty function.
const validator = require('validator');
const isEmpty = require('./is-empty');

/**
 * Validates the input from the api/users/register route
 * @author Andrew Brooks
 * @param {any} data - The variable to check whether or not it is empty.
 * @return {Object} errors - The errors object containing the value of the specific error(s)
 * @return {boolean} isValid - A boolean value on whether or not there are errors.
 */
module.exports = function validatePostInput(data) {
  // Create an errors object to store errors
  let errors = {};

  // validator can only validate String
  data.text = !isEmpty(data.text) ? data.text : '';

  // Add an error if the text is not the right length
  if(!validator.isEmpty(data.text) && !validator.isLength(data.text, {min:10,max:300})) {
    errors.text = 'Text must be between 10 and characters'
  }

  // Returns the errors object and a boolean variable of whether or not there are any errors.
  return {
    errors,
    isValid: isEmpty(errors),
  };
}
