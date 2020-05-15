/**
 * Checks to see if a given variable is empty or not.
 * @author Andrew Brooks
 * @param {any} value - The variable to check whether or not it is empty.
 * @return {boolean}
 */
const isEmpty = (value) =>
  // Check to see if the value is undefinied.
  value === undefined ||
  // Check to see if the value is null.
  value === null ||
  // Check to see if the value is an object and to see if it is empty.
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  // Check to see if the value is a string and to see if it is empty.
  (typeof value === 'string' && value.trim().length === 0);

module.exports = isEmpty;
