const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  let errors = {};

  // Validator can only validate String
  data.text = !isEmpty(data.text) ? data.text : '';

  // Add an error if the text is not the right length
  if(!Validator.isLength(data.text, {min:10,max:300})) {
    errors.text = 'Text must be between 10 and characters'
  }

  // Add an error if the text field is empty
  if (Validator.isEmpty(data.text)) {
    errors.text = 'Text field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
