/**
 * Middleware factory for executing validation schemas on req.body/req.params
 */
const validateRequest = (validator) => {
  return (req, res, next) => {
    try {
      if (typeof validator === 'function') {
        const error = validator(req);
        if (error) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: error,
            },
          });
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = validateRequest;
