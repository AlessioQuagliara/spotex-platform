/**
 * @fileoverview Rate Limiting Middleware for Production
 * @principle DDoS Protection - Prevent abuse and ensure fair usage
 */

import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

// Redis client for distributed rate limiting
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD,
});

redisClient.connect().catch(console.error);

/**
 * General API Rate Limiter
 * 100 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) : 100,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Troppe richieste da questo IP, riprova più tardi.',
    },
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  // Use Redis for distributed rate limiting
  store: process.env.NODE_ENV === 'production' ? new RedisStore({
    // @ts-ignore - Redis client type mismatch
    client: redisClient,
    prefix: 'rl:api:',
  }) : undefined,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/api/health';
  },
});

/**
 * Authentication Rate Limiter
 * 5 login attempts per 15 minutes per IP
 * Strict protection against brute force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Troppi tentativi di login, riprova tra 15 minuti.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
  store: process.env.NODE_ENV === 'production' ? new RedisStore({
    // @ts-ignore
    client: redisClient,
    prefix: 'rl:auth:',
  }) : undefined,
});

/**
 * Registration Rate Limiter
 * 3 registrations per hour per IP
 * Prevent automated account creation
 */
export const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    error: {
      code: 'REGISTRATION_RATE_LIMIT_EXCEEDED',
      message: 'Troppi tentativi di registrazione, riprova più tardi.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: process.env.NODE_ENV === 'production' ? new RedisStore({
    // @ts-ignore
    client: redisClient,
    prefix: 'rl:reg:',
  }) : undefined,
});

/**
 * Password Reset Rate Limiter
 * 3 password reset requests per hour per IP
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    error: {
      code: 'PASSWORD_RESET_RATE_LIMIT_EXCEEDED',
      message: 'Troppi tentativi di reset password, riprova più tardi.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: process.env.NODE_ENV === 'production' ? new RedisStore({
    // @ts-ignore
    client: redisClient,
    prefix: 'rl:pwd:',
  }) : undefined,
});

/**
 * API Key Rate Limiter
 * Higher limits for authenticated API requests
 * 1000 requests per 15 minutes for API key holders
 */
export const apiKeyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: {
    success: false,
    error: {
      code: 'API_KEY_RATE_LIMIT_EXCEEDED',
      message: 'Limite API superato, contatta il supporto per aumentare la quota.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use API key instead of IP
    return req.headers['x-api-key'] as string || req.ip;
  },
  store: process.env.NODE_ENV === 'production' ? new RedisStore({
    // @ts-ignore
    client: redisClient,
    prefix: 'rl:apikey:',
  }) : undefined,
});

/**
 * Deployment Rate Limiter
 * 10 deployments per hour per tenant
 * Prevent resource exhaustion
 */
export const deploymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    error: {
      code: 'DEPLOYMENT_RATE_LIMIT_EXCEEDED',
      message: 'Limite deployment raggiunto, riprova tra un\'ora.',
    },
  },
  keyGenerator: (req) => {
    // Rate limit by tenant ID
    return req.headers['x-tenant-id'] as string || req.ip;
  },
  store: process.env.NODE_ENV === 'production' ? new RedisStore({
    // @ts-ignore
    client: redisClient,
    prefix: 'rl:deploy:',
  }) : undefined,
});
