const mongoose = require('mongoose');
const path = require('path');
const env = require('./env');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    let connectionUri = env.mongodbUri;

    try {
      await mongoose.connect(connectionUri, {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`[Database] Connected to MongoDB at ${connectionUri}`);
    } catch (err) {
      console.warn(`[Database] Could not connect to primary MONGODB_URI (${connectionUri}). Starting fallback in-memory MongoDB instance...`);
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const downloadDir = path.join(__dirname, '../../../.mongo-binaries');

      mongoMemoryServer = await MongoMemoryServer.create({
        download: {
          downloadDir,
        },
      });
      connectionUri = mongoMemoryServer.getUri();
      await mongoose.connect(connectionUri);
      console.log(`[Database] Connected to fallback in-memory MongoDB at ${connectionUri}`);
    }

    return mongoose.connection;
  } catch (error) {
    console.error('[Database] MongoDB connection error:', error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
