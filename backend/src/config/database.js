const mongoose = require('mongoose');
const path = require('path');
const env = require('./env');

let mongoMemoryServer = null;

const connectDB = async () => {
  const isProduction = env.nodeEnv === 'production';
  const connectionUri = env.mongodbUri;

  if (isProduction) {
    if (!connectionUri) {
      console.error('[Database Error] MONGODB_URI environment variable is missing or empty.');
      console.error('[Database Error] Production server startup aborted. MONGODB_URI is required in production.');
      process.exit(1);
    }

    try {
      console.log('[Database] Connecting directly to production MongoDB database...');
      await mongoose.connect(connectionUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('[Database] Connected successfully to production MongoDB database!');
      return mongoose.connection;
    } catch (err) {
      console.error(`[Database Error] Could not connect to production MongoDB at ${connectionUri}. Error: ${err.message}`);
      console.error('[Database Error] Production startup aborted. In-memory database fallback is disabled in production.');
      process.exit(1);
    }
  }

  // Development / Testing Environment
  try {
    await mongoose.connect(connectionUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] Connected to MongoDB at ${connectionUri}`);
  } catch (err) {
    console.warn(`[Database] Could not connect to primary MONGODB_URI (${connectionUri}). Starting dev fallback in-memory MongoDB instance...`);
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const downloadDir = path.join(__dirname, '../../../.mongo-binaries');

    mongoMemoryServer = await MongoMemoryServer.create({
      binary: {
        version: '4.4.29',
        downloadDir,
      },
    });

    const memUri = mongoMemoryServer.getUri();
    await mongoose.connect(memUri);
    console.log(`[Database] Connected to dev fallback in-memory MongoDB at ${memUri}`);
  }

  return mongoose.connection;
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
