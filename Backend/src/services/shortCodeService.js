const Url = require('../models/Url');
const generateCode = require('../utils/generateCode');

/**
 * Generate a unique short code that does not conflict with any existing codes in the database
 * @param {number} length - Desired code length
 * @returns {Promise<string>} Unique short code
 */
const generateUniqueCode = async (length = 6) => {
  let isUnique = false;
  let code = '';
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    code = generateCode(length);
    const existingUrl = await Url.findOne({ shortCode: code });
    if (!existingUrl) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    throw new Error('Failed to generate a unique short code after several attempts');
  }

  return code;
};

module.exports = { generateUniqueCode };
