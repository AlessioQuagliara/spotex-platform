/**
 * @fileoverview Auth Service - JWT Authentication & Authorization
 * @principle DRY - Single source for all auth operations
 * @principle KISS - Simple, focused auth logic
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  corsConfig,
  rateLimitConfig,
  createLogger,
  AuthResponse,
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  User,
  UserRole,
  RolePermissions,
  ServiceResponse,
} from '@spotex/shared';
import { errorHandler, notFoundHandler, asyncHandler } from './middleware';
import routes from './routes';

const logger = createLogger('auth-service');
const app = express();
const PORT = process.env.PORT || 3001;

// ==================== SECURITY MIDDLEWARE ====================

app.use(helmet());
app.use(cors(corsConfig));

// Rate limiting - stricter for auth endpoints
const authLimiter = rateLimit({
  ...rateLimitConfig,
  max: 5, // 5 requests per window for auth
});
app.use('/api/auth', authLimiter);

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
      service: 'auth-service',
    },
    timestamp: new Date().toISOString(),
  });
});

// ==================== API ROUTES ====================

app.use('/api/auth', routes);

// ==================== ERROR HANDLING ====================

app.use(notFoundHandler);
app.use(errorHandler);

// ==================== START SERVER ====================

app.listen(PORT, () => {
  logger.info(`Auth Service started`, {
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
