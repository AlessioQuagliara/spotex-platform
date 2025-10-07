/**
 * @fileoverview Notification Controller - Business logic for notifications
 * @principle KISS - Simple notification management
 * @principle DRY - Reusable notification logic
 */

import { Request, Response } from 'express';
import {
  Notification,
  NotificationTemplate,
  ServiceResponse,
  createLogger,
  generateRandomString,
} from '@spotex/shared';
import { NotificationQueue, NotificationJob } from '../services/notification-queue';

const logger = createLogger('notification-controller');

export class NotificationController {
  private queue: NotificationQueue;
  private notifications: Notification[] = [];
  private templates: NotificationTemplate[] = [];

  constructor() {
    this.queue = new NotificationQueue();
  }

  /**
   * Get notifications for user/tenant
   */
  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, tenant_id, type, status, limit = 50 } = req.query;

      const notifications = await this.findNotifications({
        user_id: user_id as string,
        tenant_id: tenant_id as string,
        type: type as string,
        status: status as string,
        limit: parseInt(limit as string),
      });

      res.json(ServiceResponse.success(notifications));
    } catch (error) {
      logger.error('Get notifications error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Failed to retrieve notifications'));
    }
  }

  /**
   * Get notification details
   */
  async getNotification(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const notification = await this.findNotificationById(id);
      if (!notification) {
        res.status(404).json(ServiceResponse.error('NOT_FOUND', 'Notification not found'));
        return;
      }

      res.json(ServiceResponse.success(notification));
    } catch (error) {
      logger.error('Get notification error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Failed to retrieve notification'));
    }
  }

  /**
   * Send new notification (KISS: validazione e creazione semplificate)
   */
  async sendNotification(req: Request, res: Response): Promise<void> {
    try {
      const { type, recipient, subject, message, template, data, priority = 'normal' } = req.body;

      // Validazione semplice
      if (!type || !recipient || !message) {
        res.status(400).json(ServiceResponse.error('VALIDATION_ERROR', 'Type, recipient, and message are required'));
        return;
      }

      // Crea job notifica
      const notificationJob: NotificationJob = {
        id: generateRandomString(16),
        type,
        recipient,
        subject,
        message,
        template,
        data,
        priority,
      };

      // Aggiunge a coda
      await this.queue.add(notificationJob);

      // Salva record notifica
      const notification = await this.saveNotification({
        id: notificationJob.id,
        tenant_id: req.body.tenant_id || 'system',
        user_id: req.body.user_id,
        type: notificationJob.type,
        recipient: notificationJob.recipient,
        subject: notificationJob.subject,
        message: notificationJob.message,
        status: 'queued',
        priority: notificationJob.priority || 'normal',
        data: notificationJob.data,
        created_at: new Date().toISOString(),
        sent_at: undefined,
      });

      logger.info('Notification queued', {
        id: notificationJob.id,
        type: notificationJob.type,
        recipient: notificationJob.recipient,
      });

      res.status(201).json(ServiceResponse.success(notification));
    } catch (error) {
      logger.error('Send notification error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Failed to send notification'));
    }
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(req: Request, res: Response): Promise<void> {
    try {
      const { notifications } = req.body;

      if (!notifications || !Array.isArray(notifications)) {
        res.status(400).json(ServiceResponse.error('VALIDATION_ERROR', 'Notifications array is required'));
        return;
      }

      const notificationJobs: NotificationJob[] = notifications.map((n: any) => ({
        id: generateRandomString(16),
        type: n.type,
        recipient: n.recipient,
        subject: n.subject,
        message: n.message,
        template: n.template,
        data: n.data,
        priority: n.priority || 'normal',
      }));

      await this.queue.addBulkNotifications(notificationJobs);

      // Save notification records
      const savedNotifications = await Promise.all(
        notificationJobs.map(job => this.saveNotification({
          id: job.id,
          tenant_id: req.body.tenant_id || 'system',
          user_id: req.body.user_id,
          type: job.type,
          recipient: job.recipient,
          subject: job.subject,
          message: job.message,
          status: 'queued',
          priority: job.priority || 'normal',
          data: job.data,
          created_at: new Date().toISOString(),
          sent_at: undefined,
        }))
      );

      logger.info('Bulk notifications queued', { count: notificationJobs.length });

      res.status(201).json(ServiceResponse.success({
        count: savedNotifications.length,
        notifications: savedNotifications,
      }));
    } catch (error) {
      logger.error('Send bulk notifications error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Failed to send bulk notifications'));
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const notification = await this.findNotificationById(id);
      if (!notification) {
        res.status(404).json(ServiceResponse.error('NOT_FOUND', 'Notification not found'));
        return;
      }

      const updatedNotification = {
        ...notification,
        status: 'read' as const,
        read_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const savedNotification = await this.saveNotification(updatedNotification);

      res.json(ServiceResponse.success(savedNotification));
    } catch (error) {
      logger.error('Mark as read error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Failed to mark notification as read'));
    }
  }

  /**
   * Get notification templates
   */
  async getTemplates(req: Request, res: Response): Promise<void> {
    try {
      const { tenant_id, type } = req.query;

      const templates = await this.findTemplates({
        tenant_id: tenant_id as string,
        type: type as string,
      });

      res.json(ServiceResponse.success(templates));
    } catch (error) {
      logger.error('Get templates error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Failed to retrieve templates'));
    }
  }

  /**
   * Create notification template
   */
  async createTemplate(req: Request, res: Response): Promise<void> {
    try {
      const { tenant_id, name, type, subject, content, variables } = req.body;

      if (!tenant_id || !name || !type || !content) {
        res.status(400).json(ServiceResponse.error('VALIDATION_ERROR', 'Tenant ID, name, type, and content are required'));
        return;
      }

      const template: NotificationTemplate = {
        id: generateRandomString(16),
        tenant_id,
        name,
        type,
        subject,
        content,
        variables: variables || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const savedTemplate = await this.saveTemplate(template);

      logger.info('Template created', { id: template.id, name: template.name, type: template.type });

      res.status(201).json(ServiceResponse.success(savedTemplate));
    } catch (error) {
      logger.error('Create template error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Failed to create template'));
    }
  }

  /**
   * Update notification template
   */
  async updateTemplate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const template = await this.findTemplateById(id);
      if (!template) {
        res.status(404).json(ServiceResponse.error('NOT_FOUND', 'Template not found'));
        return;
      }

      const updatedTemplate = {
        ...template,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const savedTemplate = await this.saveTemplate(updatedTemplate);

      res.json(ServiceResponse.success(savedTemplate));
    } catch (error) {
      logger.error('Update template error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Failed to update template'));
    }
  }

  /**
   * Delete notification template
   */
  async deleteTemplate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const template = await this.findTemplateById(id);
      if (!template) {
        res.status(404).json(ServiceResponse.error('NOT_FOUND', 'Template not found'));
        return;
      }

      await this.deleteTemplateById(id);

      logger.info('Template deleted', { id });

      res.json(ServiceResponse.success({ message: 'Template deleted successfully' }));
    } catch (error) {
      logger.error('Delete template error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Failed to delete template'));
    }
  }

  /**
   * Test webhook endpoint
   */
  async testWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { url } = req.body;

      if (!url) {
        res.status(400).json(ServiceResponse.error('VALIDATION_ERROR', 'Webhook URL is required'));
        return;
      }

      await this.queue.addNotification({
        id: 'test-webhook',
        type: 'webhook',
        recipient: url,
        message: 'Test webhook from Spotex Platform',
        data: { test: true },
      });

      res.json(ServiceResponse.success({ message: 'Test webhook queued successfully' }));
    } catch (error) {
      logger.error('Test webhook error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Failed to test webhook'));
    }
  }

  // ==================== PRIVATE HELPER METHODS - KISS ====================

  private async findNotifications(filters: any): Promise<Notification[]> {
    // In-memory implementation for testing
    return this.notifications.filter(n => {
      if (filters.type && n.type !== filters.type) return false;
      if (filters.status && n.status !== filters.status) return false;
      if (filters.tenant_id && n.tenant_id !== filters.tenant_id) return false;
      return true;
    });
  }

  private async findNotificationById(id: string): Promise<Notification | null> {
    // In-memory implementation for testing
    return this.notifications.find(n => n.id === id) || null;
  }

  private async saveNotification(notification: Notification): Promise<Notification> {
    // In-memory implementation for testing
    this.notifications.push(notification);
    return notification;
  }

  private async findTemplates(filters: any): Promise<NotificationTemplate[]> {
    // In-memory implementation for testing
    return this.templates.filter(t => {
      if (filters.tenant_id && t.tenant_id !== filters.tenant_id) return false;
      if (filters.type && t.type !== filters.type) return false;
      return true;
    });
  }

  private async findTemplateById(id: string): Promise<NotificationTemplate | null> {
    // In-memory implementation for testing
    return this.templates.find(t => t.id === id) || null;
  }

  private async saveTemplate(template: NotificationTemplate): Promise<NotificationTemplate> {
    // In-memory implementation for testing
    this.templates.push(template);
    return template;
  }

  private async deleteTemplateById(id: string): Promise<void> {
    // In-memory implementation for testing
    const index = this.templates.findIndex(t => t.id === id);
    if (index > -1) {
      this.templates.splice(index, 1);
    }
  }
}
