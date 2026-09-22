const mongoose = require('mongoose');
const path = require('path');
const env = require('./env');

let mongoMemoryServer = null;

const connectDB = async () => {
  const isProduction = env.nodeEnv === 'production' || Boolean(process.env.RENDER);
  const connectionUri = env.mongodbUri;
  const isRemoteUri =
    connectionUri &&
    (connectionUri.startsWith('mongodb+srv://') ||
      (!connectionUri.includes('127.0.0.1') && !connectionUri.includes('localhost')));

  // For Production, Render deployment, or any Remote Database URI (e.g. MongoDB Atlas):
  if (isProduction || isRemoteUri) {
    if (!connectionUri) {
      console.error('[Database Error] MONGODB_URI environment variable is missing or empty.');
      console.error('[Database Error] Server startup aborted. MONGODB_URI is required.');
      process.exit(1);
    }

    try {
      console.log(`[Database] Connecting directly to MongoDB database (${connectionUri.substring(0, 30)}...)...`);
      await mongoose.connect(connectionUri, {
        serverSelectionTimeoutMS: 10000, // 10 seconds timeout for cloud TLS handshake
      });
      console.log('[Database] Connected successfully to MongoDB database!');
      return mongoose.connection;
    } catch (err) {
      console.error(`[Database Error] Could not connect to MongoDB database. Error: ${err.message}`);
      console.error('[Database Error] Startup aborted. In-memory database fallback is strictly disabled for remote connections.');
      process.exit(1);
    }
  }

  // Development / Testing Local Fallback ONLY (when MONGODB_URI points to localhost)
  try {
    await mongoose.connect(connectionUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] Connected to local MongoDB at ${connectionUri}`);
  } catch (err) {
    console.warn(
      `[Database] Could not connect to local MONGODB_URI (${connectionUri}). Starting dev fallback in-memory MongoDB instance...`
    );
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
