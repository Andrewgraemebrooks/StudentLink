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
module.exports = function validateRegisterInput(data) {
  // Create an errors object to store errors
  let errors = {};

  // Validator can only validate and therefore if the data is empty we set it to an empty string.
  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  // Adds an error if the name field has an incorrent number of characters.
  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  // Adds an error if the name field is empty.
  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  // Adds an error if the email field is empty.
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  // Adds an error if the email inputted is not a variable email.
  if (Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  // Adds an error if the password field is empty.
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  // Adds an error if the password is not the correct length.
  if (!(Validator.isLength(data.password), { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  // Adds an error if the confirm password field is empty.
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm password field is required';
  }

  // Adds an error if the password and the password confirmation fields do not match.
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }

  // Returns the errors object and a boolean variable of whether or not there are any errors.
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
