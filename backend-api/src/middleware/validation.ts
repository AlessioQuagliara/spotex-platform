/**
 * @fileoverview Validation Middleware
 * @principle KISS - Simple request validation
 */

import { Request, Response, NextFunction } from 'express';
import { ValidationErrorResponse } from '@spotex/shared';

/**
 * Validate request body against schema
 */
export function validateBody(schema: any) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
        value: err.value,
      }));

      const response: ValidationErrorResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: { errors },
        },
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(response);
      return;
    }

    // Replace body with validated data
    req.body = result.data;
    next();
  };
}

/**
 * Validate query parameters
 */
export function validateQuery(schema: any) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const errors = result.error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
        value: err.value,
      }));

      const response: ValidationErrorResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Query validation failed',
          details: { errors },
        },
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(response);
      return;
    }

    req.query = result.data;
    next();
  };
}

/**
 * Require tenant ID in query or from user context
 */
export function requireTenantId(req: Request, res: Response, next: NextFunction): void {
  // Check if tenantId is in query
  const tenantId = req.query.tenantId as string || req.user?.tenantId;

  if (!tenantId) {
    res.status(400).json({
      success: false,
      error: {
        code: 'MISSING_TENANT_ID',
        message: 'Tenant ID is required',
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Attach to request for easy access
  (req as any).tenantId = tenantId;
  next();
}
