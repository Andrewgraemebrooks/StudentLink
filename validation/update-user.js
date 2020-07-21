// Bring in the validator npm module and the isEmpty function.
const validator = require('validator');
const isEmpty = require('./isEmpty');

/**
 * Validates the input from the api/users/update route
 * @author Andrew Brooks
 * @param {any} userData - The inputted userData to be validated
 * @return {Object} errors - The errors object containing the value of the specific error(s)
 * @return {boolean} noErrors - A boolean value on whether or not there are errors.
 */
module.exports = function validateUpdateInput(userData) {
  // Create an errors object to store errors
  let errors = {};

  // Validator can only validate and therefore if the userData is empty we set it to an empty string.
  userData.name = !isEmpty(userData.name) ? userData.name : '';
  userData.email = !isEmpty(userData.email) ? userData.email : '';
  userData.password = !isEmpty(userData.password) ? userData.password : '';
  userData.confirmPassword = !isEmpty(userData.confirmPassword)
    ? userData.confirmPassword
    : '';

  // Adds an error if the name field has an incorrent number of characters.
  if (
    !validator.isEmpty(userData.name) &&
    !validator.isLength(userData.name, { min: 2, max: 30 })
  ) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  // Adds an error if the email inputted is not a variable email.
  if (
    !validator.isEmpty(userData.email) &&
    !validator.isEmail(userData.email)
  ) {
    errors.email = 'Email is invalid';
  }

  // Adds an error if the password is not the correct length.
  if (!(validator.isLength(userData.password), { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  // Adds an error if passwords do not match
  if (!validator.equals(userData.password, userData.confirmPassword)) {
    errors.confirmPassword = 'Passwords must match';
  }

  // Returns the errors object and a boolean variable of whether or not there are any errors.
  return {
    errors,
    noErrors: isEmpty(errors),
  };
};
