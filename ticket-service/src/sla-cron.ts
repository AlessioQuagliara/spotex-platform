/**
 * @fileoverview SLA Cron Job - Periodic SLA monitoring and escalation
 * @principle KISS - Simple cron job to run SLA checks
 */

import { slaMonitor } from './services/sla-monitor';
import { createLogger } from '@spotex/shared';

const logger = createLogger('sla-cron');

/**
 * Start SLA monitoring cron job
 */
export function startSLAMonitoring(): void {
  logger.info('Starting SLA monitoring cron job');

  // Run SLA check every 5 minutes
  const interval = 5 * 60 * 1000; // 5 minutes

  // Run initial check
  slaMonitor.checkOverdueTickets().catch((error) => {
    logger.error('Initial SLA check failed', { error: error.message });
  });

  // Set up recurring checks
  setInterval(async () => {
    try {
      await slaMonitor.checkOverdueTickets();
    } catch (error) {
      logger.error('SLA monitoring check failed', { error: (error as Error).message });
    }
  }, interval);

  logger.info(`SLA monitoring active - checking every ${interval / 1000} seconds`);
}

/**
 * Manual SLA check for testing
 */
export async function runManualSLACheck(): Promise<void> {
  logger.info('Running manual SLA check');
  await slaMonitor.checkOverdueTickets();
  logger.info('Manual SLA check completed');
}