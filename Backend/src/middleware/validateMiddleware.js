const validateJsonBody = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body: JSON payload is empty or missing'
      });
    }
  }
  next();
};

module.exports = { validateJsonBody };
