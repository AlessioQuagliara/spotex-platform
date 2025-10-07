/**
 * @fileoverview Deployment Service - Automated WordPress deployment
 * @principle KISS - Simple, focused deployment operations
 * @principle DRY - Reusable deployment logic across services
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import {
  corsConfig,
  rateLimitConfig,
  createLogger,
  ServiceResponse,
} from '@spotex/shared';
import { errorHandler, notFoundHandler, asyncHandler } from './middleware';
import routes from './routes';

const logger = createLogger('deployment-service');
const app = express();
const PORT = process.env.PORT || 3005;

// ==================== SECURITY MIDDLEWARE ====================

app.use(helmet());
app.use(cors(corsConfig));

// Rate limiting - moderate for deployment operations
const deploymentLimiter = rateLimit({
  ...rateLimitConfig,
  max: 20, // 20 requests per window for deployment ops
});
app.use('/api/deployments', deploymentLimiter);

// ==================== BODY PARSING ====================

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
      service: 'deployment-service',
    },
    timestamp: new Date().toISOString(),
  });
});

// ==================== API ROUTES ====================

app.use('/api', routes);

// ==================== ERROR HANDLING ====================

app.use(notFoundHandler);
app.use(errorHandler);

// ==================== START SERVER ====================

app.listen(PORT, () => {
  logger.info(`Deployment Service started`, {
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
