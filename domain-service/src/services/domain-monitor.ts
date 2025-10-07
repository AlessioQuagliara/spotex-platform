/**
 * @fileoverview Domain Monitor Service - Domain expiry monitoring and SSL certificate management
 * @principle KISS - Simple domain monitoring with clear notification rules
 */

import { PrismaDomainRepository } from '@spotex/shared';
import { createLogger } from '@spotex/shared';

const logger = createLogger('domain-monitor');

export interface ExpiringDomainInfo {
  domainId: string;
  tenantId: string;
  domain: string;
  expiryDate: string;
  daysUntilExpiry: number;
  tenantEmail: string;
}

export class DomainMonitor {
  private domainRepo: PrismaDomainRepository;

  constructor() {
    this.domainRepo = new PrismaDomainRepository();
  }

  /**
   * Check for expiring domains and send notifications
   */
  async checkExpiringDomains(thresholdDays: number = 30): Promise<void> {
    try {
      logger.info(`Checking for domains expiring within ${thresholdDays} days`);

      const expiringDomains = await this.findExpiringDomains(thresholdDays);

      if (expiringDomains.length === 0) {
        logger.info('No expiring domains found');
        return;
      }

      logger.warn(`Found ${expiringDomains.length} expiring domains`);

      for (const domain of expiringDomains) {
        await this.sendRenewalReminder(domain);

        // Escalate to admin if very close to expiry
        if (domain.daysUntilExpiry <= 7) {
          await this.escalateToAdmin(domain);
        }
      }

    } catch (error) {
      logger.error('Error checking expiring domains', { error: (error as Error).message });
    }
  }

  /**
   * Find all domains expiring within the threshold
   */
  private async findExpiringDomains(thresholdDays: number): Promise<ExpiringDomainInfo[]> {
    const now = new Date();
    const thresholdDate = new Date(now.getTime() + thresholdDays * 24 * 60 * 60 * 1000);

    // Get all domains
    const domains = await this.domainRepo.find({});

    const expiringDomains: ExpiringDomainInfo[] = [];

    for (const domain of domains) {
      if (!domain.expiryDate) continue;

      const expiryDate = new Date(domain.expiryDate);
      if (expiryDate <= thresholdDate) {
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        expiringDomains.push({
          domainId: domain.id,
          tenantId: domain.tenantId,
          domain: domain.name,
          expiryDate: domain.expiryDate,
          daysUntilExpiry,
          tenantEmail: domain.tenant?.adminEmail || 'admin@spotexsrl.com', // Fallback
        });
      }
    }

    return expiringDomains;
  }

  /**
   * Send renewal reminder to tenant
   */
  private async sendRenewalReminder(domain: ExpiringDomainInfo): Promise<void> {
    try {
      const notification = {
        type: 'domain_expiry_reminder',
        domainId: domain.domainId,
        domain: domain.domain,
        expiryDate: domain.expiryDate,
        daysUntilExpiry: domain.daysUntilExpiry,
        recipients: [domain.tenantEmail],
        urgent: domain.daysUntilExpiry <= 7,
      };

      logger.info('Sending domain renewal reminder', {
        domain: domain.domain,
        daysUntilExpiry: domain.daysUntilExpiry,
        recipient: domain.tenantEmail,
      });

      await this.sendNotification(notification);

    } catch (error) {
      logger.error(`Error sending renewal reminder for domain ${domain.domain}`, { error: (error as Error).message });
    }
  }

  /**
   * Escalate critical domain expiry to admin
   */
  private async escalateToAdmin(domain: ExpiringDomainInfo): Promise<void> {
    try {
      const notification = {
        type: 'domain_expiry_critical',
        domainId: domain.domainId,
        domain: domain.domain,
        expiryDate: domain.expiryDate,
        daysUntilExpiry: domain.daysUntilExpiry,
        recipients: ['admin@spotexsrl.com', 'support@spotexsrl.com'],
        priority: 'high',
      };

      logger.warn('Escalating critical domain expiry to admin', {
        domain: domain.domain,
        daysUntilExpiry: domain.daysUntilExpiry,
      });

      await this.sendNotification(notification);

      // Mark domain as requiring attention
      await this.domainRepo.update(domain.domainId, {
        status: 'expiring_soon',
        lastNotificationSent: new Date(),
      });

    } catch (error) {
      logger.error(`Error escalating domain ${domain.domain} to admin`, { error: (error as Error).message });
    }
  }

  /**
   * Send notification (placeholder for notification service integration)
   */
  private async sendNotification(notification: any): Promise<void> {
    // TODO: Integrate with notification-service microservice
    logger.info('Sending domain notification', notification);

    // Example implementation:
    // await fetch('http://notification-service:3005/api/notifications', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     type: notification.type,
    //     recipients: notification.recipients,
    //     subject: `Domain Expiry ${notification.urgent ? 'URGENT' : 'Reminder'}: ${notification.domain}`,
    //     message: `Domain ${notification.domain} expires in ${notification.daysUntilExpiry} days (${notification.expiryDate})`,
    //     priority: notification.priority || 'normal',
    //     data: notification,
    //   }),
    // });
  }

  /**
   * Check SSL certificates for domains
   */
  async checkSSLCertificates(): Promise<void> {
    try {
      logger.info('Checking SSL certificates');

      const domains = await this.domainRepo.find({
        sslEnabled: true,
      });

      for (const domain of domains) {
        await this.checkSSLCertificate(domain);
      }

    } catch (error) {
      logger.error('Error checking SSL certificates', { error: (error as Error).message });
    }
  }

  /**
   * Check SSL certificate for a specific domain
   */
  private async checkSSLCertificate(domain: any): Promise<void> {
    try {
      // TODO: Implement actual SSL certificate checking
      // This would involve:
      // 1. Connect to domain via HTTPS
      // 2. Check certificate expiry date
      // 3. Verify certificate validity
      // 4. Send notifications if expiring

      logger.info('Checking SSL certificate', { domain: domain.name });

      // Mock SSL check for now
      const mockSSLExpiry = new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000); // Random expiry within 90 days

      if (mockSSLExpiry.getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000) { // Expires within 30 days
        const daysUntilExpiry = Math.ceil((mockSSLExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

        await this.sendNotification({
          type: 'ssl_expiry_warning',
          domainId: domain.id,
          domain: domain.name,
          sslExpiryDate: mockSSLExpiry.toISOString(),
          daysUntilExpiry,
          recipients: [domain.tenant?.adminEmail || 'admin@spotexsrl.com'],
        });
      }

    } catch (error) {
      logger.error(`Error checking SSL for domain ${domain.name}`, { error: (error as Error).message });
    }
  }

  /**
   * Get domain statistics for reporting
   */
  async getDomainStatistics(tenantId?: string): Promise<any> {
    try {
      const filter = tenantId ? { tenantId } : {};

      const domains = await this.domainRepo.find(filter);
      const now = new Date();

      let totalDomains = 0;
      let activeDomains = 0;
      let expiringDomains = 0;
      let sslEnabledDomains = 0;

      for (const domain of domains) {
        totalDomains++;

        if (domain.status === 'active') {
          activeDomains++;
        }

        if (domain.sslEnabled) {
          sslEnabledDomains++;
        }

        if (domain.expiryDate) {
          const expiryDate = new Date(domain.expiryDate);
          if (expiryDate.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000) { // Expires within 30 days
            expiringDomains++;
          }
        }
      }

      return {
        totalDomains,
        activeDomains,
        expiringDomains,
        sslEnabledDomains,
        sslCoverageRate: totalDomains > 0 ? (sslEnabledDomains / totalDomains) * 100 : 0,
      };

    } catch (error) {
      logger.error('Error getting domain statistics', { error: (error as Error).message });
      throw error;
    }
  }
}

// Export singleton instance
export const domainMonitor = new DomainMonitor();