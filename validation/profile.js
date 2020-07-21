// Bring in the validator npm module and the isEmpty function.
const validator = require('validator');
const isEmpty = require('./isEmpty');

/**
 * Validates the input from the api/profile route
 * @author Andrew Brooks
 * @param {any} userData - The inputted userData to be validated
 * @return {Object} errors - The errors object containing the value of the specific error(s)
 * @return {boolean} noErrors - A boolean value on whether or not there are errors.
 */
module.exports = function validateProfileInput(userData) {
  // Create an errors object to store errors
  let errors = {};

  // Validator can only validate String so if null set to empty string
  userData.handle = !isEmpty(userData.handle) ? userData.handle : '';
  userData.university = !isEmpty(userData.university)
    ? userData.university
    : '';
  userData.bio = !isEmpty(userData.bio) ? userData.bio : '';

  // Adds an error if the handle is not the correct length
  if (!validator.isLength(userData.handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle needs to be between 2 and 4 characters';
  }
  // Adds an error if the university is not the correct length
  if (!validator.isLength(userData.university, { min: 1, max: 40 })) {
    errors.university = 'University needs to be between 1 and 100 characters';
  }
  // Adds an error if the bio is not the correct length
  if (!validator.isLength(userData.bio, { min: 1, max: 300 })) {
    errors.bio = 'Bio needs to be between 1 and 300 characters';
  }

  // Adds an error if the handle contains non-ASCII characters
  if (!validator.isAscii(userData.handle)) {
    errors.handle = 'Handle must only contain ASCII characters';
  }

  // Adds an error if the handle field is empty.
  if (validator.isEmpty(userData.handle)) {
    errors.handle = 'Handle field is required';
  }
  // Adds an error if the university field is empty.
  if (validator.isEmpty(userData.university)) {
    errors.university = 'University field is required';
  }
  // Adds an error if the bio field is empty.
  if (validator.isEmpty(userData.bio)) {
    errors.bio = 'Bio field is required';
  }

  // Returns the errors object and a boolean variable of whether or not there are any errors.
  return {
    errors,
    noErrors: isEmpty(errors),
  };
};
