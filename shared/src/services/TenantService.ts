/**
 * @fileoverview Tenant Service - Business logic for tenant management
 * @principle DRY - Extends BaseService for common operations
 * @principle KISS - Simple, focused tenant-specific logic
 */

import { BaseService, Repository } from './BaseService';
import { PrismaTenantRepository } from '../repositories/PrismaTenantRepository';
import {
  Tenant,
  TenantTier,
  TenantLimits,
  WhiteLabelConfig,
  CreateTenantDto,
  UpdateTenantDto,
} from '../types';

/**
 * Tenant Service - Specialization of BaseService
 */
export class TenantService extends BaseService<Tenant> {
  protected repository: Repository<Tenant> = new PrismaTenantRepository();

  /**
   * Create new agency tenant with default configuration
   */
  async createAgency(data: CreateTenantDto, parentTenantId?: string): Promise<Tenant> {
    const tenant = await this.create('system', {
      ...data,
      parent_tenant_id: parentTenantId,
      status: 'trial',
      white_label_config: this.getDefaultWhiteLabelConfig(),
      limits: this.getLimitsByTier(data.tier),
      trial_ends_at: this.calculateTrialEndDate(),
    } as any);

    return tenant;
  }

  /**
   * Update tenant white-label configuration
   */
  async updateWhiteLabel(
    tenantId: string,
    config: Partial<WhiteLabelConfig>
  ): Promise<Tenant> {
    const tenant = await this.findOneOrFail('system', tenantId);

    const updatedConfig = {
      ...tenant.white_label_config,
      ...config,
    };

    return this.update('system', tenantId, {
      white_label_config: updatedConfig,
    } as any);
  }

  /**
   * Upgrade tenant tier
   */
  async upgradeTier(tenantId: string, newTier: TenantTier): Promise<Tenant> {
    const tenant = await this.findOneOrFail('system', tenantId);

    if (this.isTierDowngrade(tenant.tier, newTier)) {
      throw new Error('Cannot downgrade tier. Please contact support.');
    }

    return this.update('system', tenantId, {
      tier: newTier,
      limits: this.getLimitsByTier(newTier),
    } as any);
  }

  /**
   * Get tenant statistics
   */
  async getStats(tenantId: string): Promise<{
    totalSites: number;
    totalUsers: number;
    totalTickets: number;
    usedStorage: number;
    limits: TenantLimits;
  }> {
    const tenant = await this.findOneOrFail('system', tenantId);

    // These would be calculated from related services
    return {
      totalSites: 0, // Would call siteService.count(tenantId)
      totalUsers: 0, // Would call userService.count(tenantId)
      totalTickets: 0, // Would call ticketService.count(tenantId)
      usedStorage: 0, // Would calculate from sites
      limits: tenant.limits,
    };
  }

  /**
   * Check if tenant can perform action based on limits
   */
  async canPerformAction(
    tenantId: string,
    action: 'create_site' | 'create_user' | 'create_ticket'
  ): Promise<{ allowed: boolean; reason?: string }> {
    const tenant = await this.findOneOrFail('system', tenantId);
    const stats = await this.getStats(tenantId);

    switch (action) {
      case 'create_site':
        if (stats.totalSites >= tenant.limits.maxSites) {
          return {
            allowed: false,
            reason: `Site limit reached (${tenant.limits.maxSites})`,
          };
        }
        break;
      case 'create_user':
        if (stats.totalUsers >= tenant.limits.maxUsers) {
          return {
            allowed: false,
            reason: `User limit reached (${tenant.limits.maxUsers})`,
          };
        }
        break;
      case 'create_ticket':
        if (stats.totalTickets >= tenant.limits.maxTicketsPerMonth) {
          return {
            allowed: false,
            reason: `Monthly ticket limit reached (${tenant.limits.maxTicketsPerMonth})`,
          };
        }
        break;
    }

    return { allowed: true };
  }

  // ==================== PRIVATE HELPER METHODS - KISS ====================

  private getDefaultWhiteLabelConfig(): WhiteLabelConfig {
    return {
      colors: {
        primary: '#3B82F6',
      },
      customDomains: [],
    };
  }

  private getLimitsByTier(tier: TenantTier): TenantLimits {
    const limits: Record<TenantTier, TenantLimits> = {
      starter: {
        maxSites: 5,
        maxUsers: 3,
        maxStorage: 10,
        maxBandwidth: 50,
        maxTicketsPerMonth: 10,
      },
      business: {
        maxSites: 25,
        maxUsers: 10,
        maxStorage: 50,
        maxBandwidth: 200,
        maxTicketsPerMonth: 50,
      },
      enterprise: {
        maxSites: 100,
        maxUsers: 50,
        maxStorage: 200,
        maxBandwidth: 1000,
        maxTicketsPerMonth: 200,
      },
    };

    return limits[tier];
  }

  private calculateTrialEndDate(): string {
    const now = new Date();
    now.setDate(now.getDate() + 14); // 14 days trial
    return now.toISOString();
  }

  private isTierDowngrade(currentTier: TenantTier, newTier: TenantTier): boolean {
    const tierOrder = { starter: 1, business: 2, enterprise: 3 };
    return tierOrder[newTier] < tierOrder[currentTier];
  }
}
