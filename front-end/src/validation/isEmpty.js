/**
 * Checks to see if a given variable is empty or not.
 * @author Andrew Brooks
 * @param {any} data - The inputted data to be validated
 * @return {boolean}
 */
const isEmpty = (data) =>
  // Check to see if the data is undefinied.
  data === undefined ||
  // Check to see if the data is null.
  data === null ||
  // Check to see if the data is an object and to see if it is empty.
  (typeof data === 'object' && Object.keys(data).length === 0) ||
  // Check to see if the data is a string and to see if it is empty.
  (typeof data === 'string' && data.trim().length === 0);

module.exports = isEmpty;
