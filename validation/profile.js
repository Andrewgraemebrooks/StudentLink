// Bring in the validator npm module and the isEmpty function.
const Validator = require('validator');
const isEmpty = require('./is-empty');

/**
 * Validates the input from the api/profile route
 * @author Andrew Brooks
 * @param {any} data - The variable to check whether or not it is empty.
 * @return {Object} errors - The errors object containing the value of the specific error(s)
 * @return {boolean} isValid - A boolean value on whether or not there are errors.
 */
module.exports = function validateProfileInput(data) {
  // Create an errors object to store errors
  let errors = {};

  // Validator can only validate String so if null set to empty string
  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.university = !isEmpty(data.university) ? data.university : '';
  data.bio = !isEmpty(data.bio) ? data.bio : '';

  // Adds an error if the handle is not the correct length
  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle needs to be between 2 and 4 characters';
  }
  // Adds an error if the university is not the correct length
  if (!Validator.isLength(data.university, { min: 1, max: 40 })) {
    errors.university = 'University needs to be between 1 and 100 characters';
  }
  // Adds an error if the bio is not the correct length
  if (!Validator.isLength(data.bio, { min: 1, max: 300 })) {
    errors.bio = 'Bio needs to be between 1 and 300 characters';
  }

  // Adds an error if the handle contains non-ASCII characters
  if (!Validator.isAscii(data.handle)) {
    errors.handle = 'Handle must only contain ASCII characters';
  }
  
  // Adds an error if the handle field is empty.
  if (Validator.isEmpty(data.handle)) {
    errors.handle = 'Handle field is required';
  }
  // Adds an error if the university field is empty.
  if (Validator.isEmpty(data.university)) {
    errors.university = 'University field is required';
  }
  // Adds an error if the bio field is empty.
  if (Validator.isEmpty(data.bio)) {
    errors.bio = 'Bio field is required';
  }

  // Returns the errors object and a boolean variable of whether or not there are any errors.
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
