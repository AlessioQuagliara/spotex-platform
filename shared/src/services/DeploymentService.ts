/**
 * @fileoverview Deployment Service - Business logic for WordPress site deployment
 * @principle DRY - Extends BaseService for common operations
 * @principle KISS - Simple, focused deployment-specific logic
 */

import { BaseService, Repository } from './BaseService';
import { PrismaSiteRepository } from '../repositories/PrismaSiteRepository';
import { KamateraService } from './kamatera.service';
import {
  WordPressSite,
  DeployWordPressSiteDto,
  UpdateWordPressSiteDto,
} from '../types';

/**
 * Deployment Service - Specialization of BaseService
 */
export class DeploymentService extends BaseService<WordPressSite> {
  protected repository: Repository<WordPressSite>;
  private kamateraService: KamateraService;

  constructor() {
    super();
    this.repository = new PrismaSiteRepository();
    this.kamateraService = new KamateraService();
  }

  /**
   * Deploy a new WordPress site for a tenant
   */
  async deployWordPressSite(tenantId: string, data: DeployWordPressSiteDto, userId: string): Promise<WordPressSite> {
    try {
      // Create site record with deploying status
      const site = await this.create(tenantId, {
        tenant_id: tenantId,
        name: data.name,
        domain: data.domain,
        wordpress_version: data.wordpress_version || 'latest',
        php_version: data.php_version || '8.1',
        admin_email: data.admin_email,
        admin_username: data.admin_username,
        status: 'deploying'
      } as any);

      // Deploy with Kamatera (async)
      this.performDeployment(site, data).catch(async (error) => {
        // Update site status on failure
        await this.update((site as any).tenantId, site.id, {
          status: 'error',
          error_message: (error as Error).message
        } as any);
      });

      return site;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Perform actual deployment with Kamatera
   */
  private async performDeployment(site: WordPressSite, data: DeployWordPressSiteDto): Promise<void> {
    try {
      // Deploy WordPress with Kamatera
      const deployment = await this.kamateraService.deployWordPress({
        domain: data.domain,
        adminEmail: data.admin_email,
        siteName: data.name,
      });

      // Update site with deployment details
      await this.update((site as any).tenantId, site.id, {
        status: 'active',
        deployed_at: new Date().toISOString(),
        admin_url: deployment.adminUrl,
        server_details: {
          server_id: deployment.serverId,
          ip_address: 'pending', // Will be updated by monitoring
          database_name: deployment.credentials.dbName,
          database_user: deployment.credentials.dbUser,
        },
        credentials: {
          admin_username: deployment.credentials.username,
          admin_password: deployment.credentials.password,
          database_password: deployment.credentials.dbPassword,
        }
      } as any);

    } catch (error) {
      // Update site status on failure
      await this.update((site as any).tenantId, site.id, {
        status: 'error',
        error_message: (error as Error).message
      } as any);
      throw error;
    }
  }

  /**
   * Get all WordPress sites for a tenant
   */
  async getTenantSites(tenantId: string): Promise<WordPressSite[]> {
    return this.findAll(tenantId);
  }

  /**
   * Update WordPress site configuration
   */
  async updateSite(siteId: string, tenantId: string, data: UpdateWordPressSiteDto, userId: string): Promise<WordPressSite> {
    return this.update(tenantId, siteId, data as any);
  }

  /**
   * Delete WordPress site
   */
  async deleteSite(siteId: string, tenantId: string, userId: string): Promise<void> {
    await this.update(tenantId, siteId, {
      status: 'deleting'
    } as any);

    // TODO: Trigger actual deletion process
    // For now, just mark as deleted
    setTimeout(async () => {
      await this.update(tenantId, siteId, {
        status: 'deleted'
      } as any);
    }, 2000);
  }

  /**
   * Get site deployment status
   */
  async getSiteStatus(siteId: string, tenantId: string): Promise<WordPressSite> {
    const site = await this.findOne(tenantId, siteId);
    if (!site) {
      throw new Error('Site not found');
    }
    return site;
  }
}