const crypto = require('crypto');

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const generateCode = (length = 6) => {
  let result = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += alphabet.charAt(bytes[i] % alphabet.length);
  }
  return result;
};

module.exports = generateCode;
