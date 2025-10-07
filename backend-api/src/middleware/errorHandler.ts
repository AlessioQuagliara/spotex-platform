/**
 * @fileoverview Error Handler Middleware
 * @principle KISS - Simple, consistent error handling
 */

import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@spotex/shared';
import { createLogger } from '@spotex/shared';

const logger = createLogger('backend-api');

/**
 * Global error handler - catches all errors and returns consistent format
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log error
  logger.error('Unhandled error', error, {
    method: req.method,
    path: req.path,
    body: req.body,
    user: req.user?.userId,
  });

  // Determine status code
  const statusCode = (error as any).statusCode || 500;

  // Build error response
  const response: ApiResponse = {
    success: false,
    error: {
      code: (error as any).code || 'INTERNAL_ERROR',
      message: error.message || 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? { stack: error.stack } : undefined,
    },
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
}

/**
 * 404 handler for undefined routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
    timestamp: new Date().toISOString(),
  });
}

/**
 * Async error wrapper - eliminates try/catch boilerplate
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
