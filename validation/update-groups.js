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
  data.name = !isEmpty(data.name) ? data.name : '';
  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.description = !isEmpty(data.description) ? data.description : '';

  // Adds an error if the name is not the correct length
  if (!validator.isEmpty(data.name) && !validator.isLength(data.name, { min: 2, max: 40 })) {
    errors.name = 'Name needs to be between 2 and 40 characters';
  }
  // Adds an error if the handle is not the correct length
  if (!validator.isEmpty(data.handle) && !validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle needs to be between 2 and 40 characters';
  }
  // Adds an error if the description is not the correct length
  if (!validator.isEmpty(data.description) && !validator.isLength(data.description, { min: 2, max: 200 })) {
    errors.description = 'Description needs to be between 2 and 200 characters';
  }

  // Returns the errors object and a boolean variable of whether or not there are any errors.
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
