const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || (process.env.NODE_ENV === 'production' ? '' : 'mongodb://127.0.0.1:27017/feedants'),
  clientUrl: process.env.CLIENT_URL || '*',
  jwtSecret: process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'fallback_jwt_secret_feedants_2026'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
