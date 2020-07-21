// Bring in the validator npm module and the isEmpty function.
const validator = require('validator');
const isEmpty = require('./isEmpty');

/**
 * Validates the input from the api/groups route
 * @author Andrew Brooks
 * @param {any} userData - The inputted user data to be validated
 * @return {Object} errors - The errors object containing the value of the specific error(s)
 * @return {boolean} noErrors - A boolean value on whether or not there are errors.
 */
module.exports = function validateGroupInput(userData) {
  // Create an errors object to store errors
  let errors = {};

  // Validator can only validate String so if null set to empty string
  userData.name = !isEmpty(userData.name) ? userData.name : '';
  userData.handle = !isEmpty(userData.handle) ? userData.handle : '';
  userData.description = !isEmpty(userData.description)
    ? userData.description
    : '';

  // Adds an error if the name field is empty.
  if (validator.isEmpty(userData.name)) {
    errors.name = 'Name field is required';
  }
  // Adds an error if the handle field is empty.
  if (validator.isEmpty(userData.handle)) {
    errors.handle = 'Handle field is required';
  }
  // Adds an error if the description field is empty.
  if (validator.isEmpty(userData.description)) {
    errors.description = 'Description field is required';
  }

  // Adds an error if the name is not the correct length
  if (!validator.isLength(userData.name, { min: 2, max: 40 })) {
    errors.name = 'Name needs to be between 2 and 40 characters';
  }

  // Adds an error if the handle is not the correct length
  if (!validator.isLength(userData.handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle needs to be between 2 and 40 characters';
  }

  // Adds an error if the description is not the correct length
  if (!validator.isLength(userData.description, { min: 2, max: 200 })) {
    errors.description = 'Description needs to be between 2 and 200 characters';
  }

  // Returns the errors object and a boolean variable of whether or not there are any errors.
  return {
    errors,
    noErrors: isEmpty(errors),
  };
};
