/**
 * @fileoverview Shared Index - Main entry point
 * @principle DRY - Single source of truth for entire platform
 */

// Types
export * from './types/core';
export * from './types/api';
export * from './types/auth';
export * from './types/dto';

// Services
export * from './services/BaseService';
export * from './services/TenantService';
export * from './services/TicketService';
export * from './services/DeploymentService';
export * from './services/kamatera.service';
export { getPrismaClient, disconnectPrisma, checkDatabaseHealth } from './services/prisma.service';
export type { PrismaClient } from './services/prisma.service';

// Repositories
export * from './repositories/PrismaTenantRepository';
export * from './repositories/PrismaSiteRepository';
export * from './repositories/PrismaTicketRepository';
export * from './repositories/PrismaDomainRepository';

// Utils
export * from './utils/index';

// Config
export * from './config/index';
