/**
 * Remove special characters and return an array of tokens (words).
 * @param  {string} input Input string
 * @return {array}        Array of tokens
 */
module.exports = input =>
  input
    .toLowerCase()
    .replace(/\n/g, " ")
    .replace(/[.,\/#!?$%\^&\*;:{}=_`\"~()]/g, " ")
    .replace(/\s\s+/g, " ")
    .trim();
