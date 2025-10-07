/**
 * @fileoverview Error Handler Middleware - Gestione centralizzata errori
 * @principle DRY - Handler unico per tutti gli errori
 * @principle KISS - Struttura errori semplice e chiara
 */

import { Request, Response, NextFunction } from 'express';
import { ServiceResponse } from '../services/BaseService';
import { createLogger } from './logger';

const logger = createLogger('error-handler');

/**
 * Errore applicativo con codice e status
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Middleware di gestione errori (KISS: centralizza gestione errori)
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log errore
  logger.error('Request error', err, {
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Determina status code e messaggio
  if (err instanceof AppError) {
    res.status(err.statusCode).json(
      ServiceResponse.error(err.code, err.message)
    );
  } else {
    // Errore generico
    res.status(500).json(
      ServiceResponse.error('INTERNAL_ERROR', 'An unexpected error occurred')
    );
  }
}

/**
 * Handler 404 - Route non trovata
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json(
    ServiceResponse.error('NOT_FOUND', `Route ${req.path} not found`)
  );
}

/**
 * Wrapper async per catch automatico errori (DRY: elimina try-catch ripetitivi)
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
