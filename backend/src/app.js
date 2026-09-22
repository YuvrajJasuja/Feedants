const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const notFoundHandler = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const healthRoutes = require('./routes/healthRoutes');
const competitionRoutes = require('./routes/competitionRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Security Headers
app.use(helmet());

// CORS Configuration
const allowedOrigins = [
  env.clientUrl,
  'http://localhost:8081',
  'http://localhost:19006',
  'http://localhost:3000',
  'http://127.0.0.1:8081',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser agents or requests during development
      if (!origin || env.nodeEnv === 'development' || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error('CORS Policy: Origin not allowed.'));
    },
    credentials: true,
  })
);

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger (Development)
if (env.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.url}`);
    next();
  });
}

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/me', userRoutes);
app.use('/api/competitions', competitionRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
