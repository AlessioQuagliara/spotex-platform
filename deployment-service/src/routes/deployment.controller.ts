/**
 * @fileoverview Deployment Controller - REST API for WordPress site deployments
 * @principle KISS - Simple, focused deployment operations
 * @principle DRY - Reusable deployment logic
 */

import { Request, Response } from 'express';
import { DeploymentService } from '@spotex/shared';
import { createLogger } from '@spotex/shared';

const logger = createLogger('deployment-controller');
const deploymentService = new DeploymentService();

export class DeploymentController {
  /**
   * Get all deployments for tenant
   */
  async getDeployments(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.query.tenant_id as string || (req as any).user?.tenant_id;

      if (!tenantId) {
        res.status(400).json({
          success: false,
          error: 'Tenant ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const sites = await deploymentService.findAll(tenantId);

      res.json({
        success: true,
        data: sites,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Failed to get deployments', { error: error.message });
      res.status(400).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Get deployment details
   */
  async getDeployment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const tenantId = req.query.tenant_id as string || (req as any).user?.tenant_id;

      if (!tenantId) {
        res.status(400).json({
          success: false,
          error: 'Tenant ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Find site by ID and tenant
      const sites = await deploymentService.findAll(tenantId, { id } as any);
      const site = sites[0];

      if (!site) {
        res.status(404).json({
          success: false,
          error: 'Deployment not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.json({
        success: true,
        data: site,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Failed to get deployment', { error: error.message });
      res.status(404).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Create new deployment
   */
  async createDeployment(req: Request, res: Response): Promise<void> {
/**   * Test deployment without tenant validation   */  async testDeployment(req: Request, res: Response): Promise<void> {    try {      const data = req.body;      const site = await this.deploymentService.deployWordPressSite("test-tenant-001", data, "system");      res.status(201).json({        success: true,        data: site,        message: "Test WordPress site deployment initiated",        timestamp: new Date().toISOString(),      });    } catch (error: any) {      logger.error("Failed to create test deployment", { error: error.message });      res.status(400).json({        success: false,        error: error.message,        timestamp: new Date().toISOString(),      });    }  }
    try {
      const tenantId = req.body.tenant_id || (req as any).user?.tenant_id;
      const data = req.body;
      const userId = (req as any).user?.id || 'system';

      if (!tenantId) {
        res.status(400).json({
          success: false,
          error: 'Tenant ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const site = await deploymentService.deployWordPressSite(tenantId, data, userId);

      res.status(201).json({
        success: true,
        data: site,
        message: 'WordPress site deployment initiated',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Failed to create deployment', { error: error.message });
      res.status(400).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Update deployment
   */
  async updateDeployment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const tenantId = req.body.tenant_id || (req as any).user?.tenant_id;
      const data = req.body;
      const userId = (req as any).user?.id || 'system';

      if (!tenantId) {
        res.status(400).json({
          success: false,
          error: 'Tenant ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const site = await deploymentService.updateSite(id, tenantId, data, userId);

      res.json({
        success: true,
        data: site,
        message: 'Deployment updated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Failed to update deployment', { error: error.message });
      res.status(400).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Cancel deployment
   */
  async cancelDeployment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const tenantId = req.query.tenant_id as string || (req as any).user?.tenant_id;
      const userId = (req as any).user?.id || 'system';

      if (!tenantId) {
        res.status(400).json({
          success: false,
          error: 'Tenant ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      await deploymentService.deleteSite(id, tenantId, userId);

      res.json({
        success: true,
        message: 'Deployment cancellation initiated',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Failed to cancel deployment', { error: error.message });
      res.status(400).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Retry failed deployment
   */
  async retryDeployment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const tenantId = req.query.tenant_id as string || (req as any).user?.tenant_id;
      const userId = (req as any).user?.id || 'system';

      if (!tenantId) {
        res.status(400).json({
          success: false,
          error: 'Tenant ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Find the original site
      const sites = await deploymentService.findAll(tenantId, { id } as any);
      const site = sites[0];

      if (!site) {
        res.status(404).json({
          success: false,
          error: 'Deployment not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // For retry, we'll redeploy with the same configuration
      const retryData = {
        domain: site.domain,
        name: site.name,
        admin_username: site.admin_username,
        admin_email: 'admin@example.com', // Default for retry
        admin_password: 'temp_password_' + Date.now(), // Generate temp password
      };

      const newSite = await deploymentService.deployWordPressSite(tenantId, retryData, userId);

      res.json({
        success: true,
        data: newSite,
        message: 'Deployment retry initiated',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Failed to retry deployment', { error: error.message });
      res.status(400).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Get deployment logs
   */
  async getDeploymentLogs(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const tenantId = req.query.tenant_id as string || (req as any).user?.tenant_id;

      if (!tenantId) {
        res.status(400).json({
          success: false,
          error: 'Tenant ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Mock logs for now - in real implementation, this would fetch from logging service
      const logs = [
        { timestamp: new Date().toISOString(), level: 'info', message: `Deployment ${id} started` },
        { timestamp: new Date().toISOString(), level: 'info', message: `WordPress core installed for ${id}` },
        { timestamp: new Date().toISOString(), level: 'info', message: `Theme activated for ${id}` },
        { timestamp: new Date().toISOString(), level: 'info', message: `Deployment ${id} completed successfully` }
      ];

      res.json({
        success: true,
        data: logs,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Failed to get deployment logs', { error: error.message });
      res.status(400).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Create site backup
   */
  async createBackup(req: Request, res: Response): Promise<void> {
    try {
      const { siteId } = req.params;
      const tenantId = req.query.tenant_id as string || (req as any).user?.tenant_id;
      const userId = (req as any).user?.id || 'system';

      if (!tenantId) {
        res.status(400).json({
          success: false,
          error: 'Tenant ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Mock backup creation - in real implementation, this would trigger actual backup
      const backup = {
        id: `backup_${Date.now()}`,
        siteId,
        tenantId,
        createdAt: new Date().toISOString(),
        status: 'completed',
        size: '150MB'
      };

      res.status(201).json({
        success: true,
        data: backup,
        message: 'Backup created successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Failed to create backup', { error: error.message });
      res.status(400).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Restore site from backup
   */
  async restoreBackup(req: Request, res: Response): Promise<void> {
    try {
      const { siteId } = req.params;
      const { backupId } = req.body;
      const tenantId = req.query.tenant_id as string || (req as any).user?.tenant_id;
      const userId = (req as any).user?.id || 'system';

      if (!tenantId || !backupId) {
        res.status(400).json({
          success: false,
          error: 'Tenant ID and backup ID are required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Mock restore - in real implementation, this would trigger actual restore
      res.json({
        success: true,
        message: 'Site restore initiated',
        data: {
          siteId,
          backupId,
          status: 'in_progress',
          startedAt: new Date().toISOString()
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Failed to restore backup', { error: error.message });
      res.status(400).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Get site backups
   */
  async getBackups(req: Request, res: Response): Promise<void> {
    try {
      const { siteId } = req.params;
      const tenantId = req.query.tenant_id as string || (req as any).user?.tenant_id;

      if (!tenantId) {
        res.status(400).json({
          success: false,
          error: 'Tenant ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Mock backups list - in real implementation, this would fetch from database
      const backups = [
        {
          id: 'backup_001',
          siteId,
          tenantId,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          status: 'completed',
          size: '150MB'
        },
        {
          id: 'backup_002',
          siteId,
          tenantId,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          status: 'completed',
          size: '148MB'
        }
      ];

      res.json({
        success: true,
        data: backups,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Failed to get backups', { error: error.message });
      res.status(400).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}