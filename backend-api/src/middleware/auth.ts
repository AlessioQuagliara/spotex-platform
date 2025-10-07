/**
 * @fileoverview Auth Middleware - Centralized authentication
 * @principle DRY - Single auth middleware used by all endpoints
 * @principle KISS - Simple JWT validation
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload, Permission } from '@spotex/shared';

// Extend Express Request with user data
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Verify JWT token and attach user to request
 */
export function requireAuth(requiredPermissions: Permission[] = []) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract token
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'No token provided',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const token = authHeader.replace('Bearer ', '');

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      // Check permissions if required
      if (requiredPermissions.length > 0) {
        const hasPermission = requiredPermissions.some(permission =>
          decoded.permissions.includes(permission)
        );

        if (!hasPermission) {
          res.status(403).json({
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'Insufficient permissions',
            },
            timestamp: new Date().toISOString(),
          });
          return;
        }
      }

      // Attach user to request
      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          success: false,
          error: {
            code: 'TOKEN_EXPIRED',
            message: 'Token has expired',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid token',
        },
        timestamp: new Date().toISOString(),
      });
    }
  };
}

/**
 * Optional auth - attaches user if token present, but doesn't require it
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      req.user = decoded;
    }
    next();
  } catch {
    // Ignore errors for optional auth
    next();
  }
}

/**
 * Require specific role
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Required role: ${roles.join(' or ')}`,
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  };
}
