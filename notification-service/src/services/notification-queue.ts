/**
 * @fileoverview Notification Queue Service - Async notification processing
 * @principle KISS - Simple queue management for notifications
 */

import Queue from 'bull';
import { createLogger } from '@spotex/shared';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { WebhookService } from './webhook.service';

const logger = createLogger('notification-queue');

export interface NotificationJob {
  id: string;
  type: 'email' | 'sms' | 'webhook' | 'in_app';
  recipient: string;
  subject?: string;
  message: string;
  template?: string;
  data?: Record<string, any>;
  priority?: 'low' | 'normal' | 'high';
}

export class NotificationQueue {
  private emailQueue: Queue.Queue;
  private smsQueue: Queue.Queue;
  private webhookQueue: Queue.Queue;
  private inAppQueue: Queue.Queue;

  private emailService: EmailService;
  private smsService: SmsService;
  private webhookService: WebhookService;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    // Initialize queues
    this.emailQueue = new Queue('email-notifications', redisUrl);
    this.smsQueue = new Queue('sms-notifications', redisUrl);
    this.webhookQueue = new Queue('webhook-notifications', redisUrl);
    this.inAppQueue = new Queue('in-app-notifications', redisUrl);

    // Initialize services
    this.emailService = new EmailService();
    this.smsService = new SmsService();
    this.webhookService = new WebhookService();

    this.setupQueueProcessors();
    this.setupQueueEvents();
  }

  /**
   * Add notification to appropriate queue (DRY: usa metodo comune)
   */
  async addNotification(notification: NotificationJob): Promise<void> {
    await this.add(notification);
    logger.info('Notification added to queue', {
      id: notification.id,
      type: notification.type,
      recipient: notification.recipient,
    });
  }

  /**
   * Add multiple notifications to queue
   */
  async addBulkNotifications(notifications: NotificationJob[]): Promise<void> {
    const emailJobs = notifications.filter(n => n.type === 'email');
    const smsJobs = notifications.filter(n => n.type === 'sms');
    const webhookJobs = notifications.filter(n => n.type === 'webhook');
    const inAppJobs = notifications.filter(n => n.type === 'in_app');

    if (emailJobs.length > 0) {
      await this.emailQueue.addBulk(emailJobs.map(job => ({
        data: job,
        opts: { priority: this.getPriorityValue(job.priority) },
      })));
    }

    if (smsJobs.length > 0) {
      await this.smsQueue.addBulk(smsJobs.map(job => ({
        data: job,
        opts: { priority: this.getPriorityValue(job.priority) },
      })));
    }

    if (webhookJobs.length > 0) {
      await this.webhookQueue.addBulk(webhookJobs.map(job => ({
        data: job,
        opts: { priority: this.getPriorityValue(job.priority) },
      })));
    }

    if (inAppJobs.length > 0) {
      await this.inAppQueue.addBulk(inAppJobs.map(job => ({
        data: job,
        opts: { priority: this.getPriorityValue(job.priority) },
      })));
    }

    logger.info('Bulk notifications added to queue', { count: notifications.length });
  }

  /**
   * Get queue statistics (KISS: metodo generico riutilizzabile)
   */
  private async getQueueCount(method: 'getWaiting' | 'getActive' | 'getCompleted' | 'getFailed'): Promise<number> {
    const queues = [this.emailQueue, this.smsQueue, this.webhookQueue, this.inAppQueue];
    const results = await Promise.all(queues.map(q => q[method]()));
    return results.reduce((sum, jobs) => sum + jobs.length, 0);
  }

  async getWaitingCount(): Promise<number> {
    return this.getQueueCount('getWaiting');
  }

  async getActiveCount(): Promise<number> {
    return this.getQueueCount('getActive');
  }

  async getCompletedCount(): Promise<number> {
    return this.getQueueCount('getCompleted');
  }

  async getFailedCount(): Promise<number> {
    return this.getQueueCount('getFailed');
  }

  /**
   * Add notification job to appropriate queue (KISS: mappa tipo -> queue)
   */
  async add(job: NotificationJob): Promise<void> {
    const queueMap = {
      email: this.emailQueue,
      sms: this.smsQueue,
      webhook: this.webhookQueue,
      in_app: this.inAppQueue,
    };

    const queue = queueMap[job.type];
    if (!queue) {
      throw new Error(`Unknown notification type: ${job.type}`);
    }

    const priority = this.getPriorityValue(job.priority);
    await queue.add(job, { priority });
    logger.info('Notification job added to queue', { id: job.id, type: job.type });
  }
  async close(): Promise<void> {
    await Promise.all([
      this.emailQueue.close(),
      this.smsQueue.close(),
      this.webhookQueue.close(),
      this.inAppQueue.close(),
    ]);
  }

  // ==================== PRIVATE METHODS ====================

  private setupQueueProcessors(): void {
    // Email processor
    this.emailQueue.process(async (job) => {
      await this.emailService.sendEmail(job.data);
    });

    // SMS processor
    this.smsQueue.process(async (job) => {
      await this.smsService.sendSms(job.data);
    });

    // Webhook processor
    this.webhookQueue.process(async (job) => {
      await this.webhookService.sendWebhook(job.data);
    });

    // In-app processor
    this.inAppQueue.process(async (job) => {
      await this.saveInAppNotification(job.data);
    });
  }

  private setupQueueEvents(): void {
    const queues = [this.emailQueue, this.smsQueue, this.webhookQueue, this.inAppQueue];

    queues.forEach((queue, index) => {
      const queueNames = ['email', 'sms', 'webhook', 'in_app'];

      queue.on('completed', (job) => {
        logger.info(`Notification ${queueNames[index]} completed`, {
          jobId: job.id,
          notificationId: job.data.id,
        });
      });

      queue.on('failed', (job, err) => {
        logger.error(`Notification ${queueNames[index]} failed`, {
          jobId: job.id,
          notificationId: job.data.id,
          error: err.message,
        });
      });
    });
  }

  private getPriorityValue(priority?: string): number {
    switch (priority) {
      case 'high': return 10;
      case 'normal': return 5;
      case 'low': return 1;
      default: return 5;
    }
  }

  private async saveInAppNotification(notification: NotificationJob): Promise<void> {
    // Placeholder - would save to database
    logger.info('In-app notification saved', {
      id: notification.id,
      recipient: notification.recipient,
      message: notification.message,
    });
  }
}
