/**
 * @fileoverview Notification Service - Email, SMS & webhook notifications
 * @principle KISS - Simple, focused notification operations
 * @principle DRY - Reusable notification logic across services
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
import { NotificationQueue } from './services/notification-queue';

const logger = createLogger('notification-service');
const app = express();
const PORT = process.env.PORT || 3006;

// Initialize notification queue
const notificationQueue = new NotificationQueue();

// ==================== SECURITY MIDDLEWARE ====================

app.use(helmet());
app.use(cors(corsConfig));

// Rate limiting - moderate for notification operations
const notificationLimiter = rateLimit({
  ...rateLimitConfig,
  max: 100, // 100 requests per window for notifications
});
app.use('/api/notifications', notificationLimiter);

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
      service: 'notification-service',
      queue: {
        waiting: notificationQueue.getWaitingCount(),
        active: notificationQueue.getActiveCount(),
        completed: notificationQueue.getCompletedCount(),
        failed: notificationQueue.getFailedCount(),
      },
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
  logger.info(`Notification Service started`, {
    port: PORT,
    env: process.env.NODE_ENV,
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await notificationQueue.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await notificationQueue.close();
  process.exit(0);
});

export default app;
