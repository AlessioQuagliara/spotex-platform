/**
 * @fileoverview Utils Index
 * @principle DRY - Single import point for all utilities
 */

export * from './helpers';
export * from './logger';
export * from './validation';
export * from './error-handler';
export * from './sla-calculator';
export * from './notifications';

// ==================== SLA UTILITIES ====================

/**
 * Calculate if SLA is breached
 */
export function calculateSLABreach(slaDeadline: string): boolean {
  return new Date() > new Date(slaDeadline);
}

/**
 * Get SLA target hours based on priority and type
 */
export function getSLATargetHours(priority: string, type: string): number {
  const baseHours: Record<string, number> = {
    low: 72,      // 3 days
    medium: 24,   // 1 day
    high: 8,      // 8 hours
    urgent: 2,    // 2 hours
  };

  const typeMultiplier: Record<string, number> = {
    technical: 1,
    billing: 1.5,
    feature: 2,
    bug: 1.2,
    general: 1,
  };

  return baseHours[priority] * typeMultiplier[type];
}
