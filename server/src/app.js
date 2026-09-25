import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import authRouter from './routes/auth.js';
import eventsRouter from './routes/events.js';
import notificationsRouter from './routes/notifications.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// API gateway base endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to CampusConnect API Gateway'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'CampusConnect API is operational',
    timestamp: new Date().toISOString()
  });
});

// Authentication routes
app.use('/api/auth', authRouter);

// Events routes (Milestone 7)
app.use('/api/events', eventsRouter);

// Notifications routes (Milestone 8)
app.use('/api/notifications', notificationsRouter);

// Fallback Route for non-existent endpoints (404)
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global Error Handler (500)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    status: 'error',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

export default app;
