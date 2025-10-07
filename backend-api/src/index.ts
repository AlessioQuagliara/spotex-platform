/**
 * @fileoverview Main Application Entry Point
 * @principle KISS - Simple Express setup
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { corsConfig, rateLimitConfig, createLogger } from '@spotex/shared';
import { errorHandler, notFoundHandler } from './middleware';
import routes from './routes';

const logger = createLogger('backend-api');
const app = express();
const PORT = process.env.PORT || 3000;

// ==================== SECURITY MIDDLEWARE ====================

// Helmet - security headers
app.use(helmet());

// CORS - cross-origin requests
app.use(cors(corsConfig));

// Rate limiting
const limiter = rateLimit(rateLimitConfig);
app.use('/api', limiter);

// ==================== BODY PARSING ====================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==================== LOGGING ====================

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// ==================== HEALTH CHECK ====================

app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    timestamp: new Date().toISOString(),
  });
});

// ==================== API ROUTES ====================

app.use('/api', routes);

// ==================== ERROR HANDLING ====================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ==================== START SERVER ====================

app.listen(PORT, () => {
  logger.info(`Backend API started`, {
    port: PORT,
    env: process.env.NODE_ENV,
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
