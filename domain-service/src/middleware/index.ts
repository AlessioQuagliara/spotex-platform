/**
 * @fileoverview Domain Service Middleware
 * @principle DRY - Reusable middleware for domain service
 */

import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@spotex/shared';

/**
 * Global error handler for domain service
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = (error as any).statusCode || 500;

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
 * 404 handler
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
 * Async error wrapper
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
