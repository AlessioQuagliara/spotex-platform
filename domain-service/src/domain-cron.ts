/**
 * @fileoverview Domain Cron Job - Periodic domain monitoring and SSL checks
 * @principle KISS - Simple cron job to run domain checks
 */

import { domainMonitor } from './services/domain-monitor';
import { createLogger } from '@spotex/shared';

const logger = createLogger('domain-cron');

/**
 * Start domain monitoring cron jobs
 */
export function startDomainMonitoring(): void {
  logger.info('Starting domain monitoring cron jobs');

  // Check expiring domains daily at 9 AM
  const dailyInterval = 24 * 60 * 60 * 1000; // 24 hours

  // Check SSL certificates every 6 hours
  const sslInterval = 6 * 60 * 60 * 1000; // 6 hours

  // Run initial checks
  domainMonitor.checkExpiringDomains(30).catch((error) => {
    logger.error('Initial domain expiry check failed', { error: error.message });
  });

  domainMonitor.checkSSLCertificates().catch((error) => {
    logger.error('Initial SSL check failed', { error: error.message });
  });

  // Set up recurring domain expiry checks (daily)
  setInterval(async () => {
    try {
      await domainMonitor.checkExpiringDomains(30);
    } catch (error) {
      logger.error('Domain expiry monitoring check failed', { error: (error as Error).message });
    }
  }, dailyInterval);

  // Set up recurring SSL checks (every 6 hours)
  setInterval(async () => {
    try {
      await domainMonitor.checkSSLCertificates();
    } catch (error) {
      logger.error('SSL monitoring check failed', { error: (error as Error).message });
    }
  }, sslInterval);

  logger.info('Domain monitoring active - expiry checks daily, SSL checks every 6 hours');
}

/**
 * Manual domain checks for testing
 */
export async function runManualDomainChecks(): Promise<void> {
  logger.info('Running manual domain checks');
  await domainMonitor.checkExpiringDomains(30);
  await domainMonitor.checkSSLCertificates();
  logger.info('Manual domain checks completed');
}