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
module.exports = function validateRegisterInput(userData) {
  // Create an errors object to store errors
  let errors = {};

  // Validator can only validate and therefore if the userData is empty we set it to an empty string.
  userData.name = !isEmpty(userData.name) ? userData.name : '';
  userData.email = !isEmpty(userData.email) ? userData.email : '';
  userData.password = !isEmpty(userData.password) ? userData.password : '';
  userData.password2 = !isEmpty(userData.password2) ? userData.password2 : '';

  // Adds an error if the name field has an incorrent number of characters.
  if (!validator.isLength(userData.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  // Adds an error if the name field is empty.
  if (validator.isEmpty(userData.name)) {
    errors.name = 'Name field is required';
  }

  // Adds an error if the email inputted is not a variable email.
  if (!validator.isEmail(userData.email)) {
    errors.email = 'Email is invalid';
  }

  // Adds an error if the email field is empty.
  if (validator.isEmpty(userData.email)) {
    errors.email = 'Email field is required';
  }

  // Adds an error if the password field is empty.
  if (validator.isEmpty(userData.password)) {
    errors.password = 'Password field is required';
  }

  // Adds an error if the password is not the correct length.
  if (!(validator.isLength(userData.password), { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  // Adds an error if confirm password is empty
  if (validator.isEmpty(userData.password2)) {
    errors.password2 = 'Confirm password field is required';
  }

  // Adds an error if passwords do not match
  if (!validator.equals(userData.password, userData.password2)) {
    errors.password2 = 'Passwords must match';
  }

  // Returns the errors object and a boolean variable of whether or not there are any errors.
  return {
    errors,
    noErrors: isEmpty(errors),
  };
};
