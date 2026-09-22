const mongoose = require('mongoose');

const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName] || req.body[paramName] || req.query[paramName];
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: `The provided identifier '${id}' is not a valid MongoDB ObjectId.`,
        },
      });
    }
    next();
  };
};

const validatePaginationParams = (req, res, next) => {
  let { page, limit } = req.query;

  if (page !== undefined) {
    const parsedPage = parseInt(page, 10);
    if (isNaN(parsedPage) || parsedPage < 1) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PAGINATION',
          message: 'Query parameter "page" must be a positive integer greater than 0.',
        },
      });
    }
    req.query.page = parsedPage;
  } else {
    req.query.page = 1;
  }

  if (limit !== undefined) {
    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PAGINATION',
          message: 'Query parameter "limit" must be a positive integer between 1 and 100.',
        },
      });
    }
    req.query.limit = parsedLimit;
  } else {
    req.query.limit = 10;
  }

  next();
};

const validateAuthInput = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_EMAIL',
        message: 'A valid email address is required.',
      },
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_EMAIL',
        message: 'Please enter a valid email address format (e.g. user@domain.com).',
      },
    });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_PASSWORD',
        message: 'Password must be at least 6 characters long.',
      },
    });
  }

  next();
};

module.exports = {
  validateObjectId,
  validatePaginationParams,
  validateAuthInput,
};
