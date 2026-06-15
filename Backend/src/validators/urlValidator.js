const validateUrl = require('../utils/validateUrl');

const validateCreateUrl = (req, res, next) => {
  const { originalUrl } = req.body;

  if (!originalUrl || originalUrl.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Original URL is required'
    });
  }

  if (!validateUrl(originalUrl)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid URL (including http:// or https://)'
    });
  }

  next();
};

module.exports = {
  validateCreateUrl
};
