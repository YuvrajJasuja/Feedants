const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  if (env.nodeEnv !== 'test') {
    console.error('[Error Middleware]:', err?.message || err);
  }

  const statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';

  // In production, do not leak internal database/server details for status 500
  let message = err.message || 'An unexpected error occurred on the server.';
  if (statusCode === 500 && env.nodeEnv === 'production') {
    message = 'An internal server error occurred. Please try again later.';
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: message,
    },
  });
};

module.exports = errorHandler;
