const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feedants',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:8081',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
};
