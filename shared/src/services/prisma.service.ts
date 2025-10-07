/**
 * @fileoverview Prisma Database Service - Centralized database access
 * @principle DRY - Single source of truth for database operations
 * @principle KISS - Simple Prisma client wrapper
 */

import { PrismaClient } from '@prisma/client';
import { createLogger } from '../utils/logger';

const logger = createLogger('prisma-service');

// Singleton Prisma Client
let prisma: PrismaClient | null = null;

/**
 * Get Prisma Client instance (singleton)
 */
export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
    });

    // Log queries in development
    if (process.env.NODE_ENV === 'development') {
      prisma.$on('query' as never, (e: any) => {
        logger.debug('Query', {
          query: e.query,
          params: e.params,
          duration: `${e.duration}ms`,
        });
      });
    }

    // Handle shutdown
    process.on('beforeExit', async () => {
      await prisma?.$disconnect();
      logger.info('Prisma disconnected');
    });

    logger.info('Prisma client initialized');
  }

  return prisma;
}

/**
 * Disconnect Prisma Client
 */
export async function disconnectPrisma(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
    logger.info('Prisma disconnected manually');
  }
}

/**
 * Health check for database connection
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const client = getPrismaClient();
    await client.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error('Database health check failed', error);
    return false;
  }
}

// Export Prisma Client type for use in services
export type { PrismaClient } from '@prisma/client';