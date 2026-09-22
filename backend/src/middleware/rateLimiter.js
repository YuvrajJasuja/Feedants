const env = require('../config/env');

const createRateLimiter = (options = {}) => {
  const windowMs = options.windowMs || parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000;
  const maxRequests = options.max || parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100;
  const message = options.message || 'Too many requests from this IP, please try again later.';

  const hits = new Map();

  // Cleanup expired entries periodically
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of hits.entries()) {
      if (now > record.resetTime) {
        hits.delete(ip);
      }
    }
  }, Math.min(windowMs, 60000));

  return (req, res, next) => {
    // Skip rate limiting during testing / non-production if configured
    if (process.env.NODE_ENV === 'test') {
      return next();
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    let record = hits.get(ip);
    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      hits.set(ip, record);
      return next();
    }

    record.count += 1;
    if (record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: message,
          retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
        },
      });
    }

    next();
  };
};

// Specialized Limiters
const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: 'Too many API requests, please slow down.',
});

const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many login or registration attempts. Please try again in 15 minutes.',
});

const actionLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 60,
  message: 'Too many submission or review actions. Please wait a moment before trying again.',
});

module.exports = {
  generalLimiter,
  authLimiter,
  actionLimiter,
  createRateLimiter,
};
