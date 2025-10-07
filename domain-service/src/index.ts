/**
 * @fileoverview Domain Service - Domain management & SSL certificates
 * @principle KISS - Simple, focused domain operations
 * @principle DRY - Reusable domain logic across services
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
import { startDomainMonitoring } from './domain-cron';

const logger = createLogger('domain-service');
const app = express();
const PORT = process.env.PORT || 3003;

// ==================== SECURITY MIDDLEWARE ====================

app.use(helmet());
app.use(cors(corsConfig));

// Rate limiting - moderate for domain operations
const domainLimiter = rateLimit({
  ...rateLimitConfig,
  max: 50, // 50 requests per window for domain ops
});
app.use('/api/domains', domainLimiter);

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
      service: 'domain-service',
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
  logger.info(`Domain Service started`, {
    port: PORT,
    env: process.env.NODE_ENV,
  });

  // Start domain monitoring
  startDomainMonitoring();
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
