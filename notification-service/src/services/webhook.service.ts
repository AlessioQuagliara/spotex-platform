/**
 * @fileoverview Webhook Service - HTTP webhook notifications
 * @principle KISS - Simple webhook delivery with retry logic
 */

import axios, { AxiosResponse } from 'axios';
import { createLogger } from '@spotex/shared';
import { NotificationJob } from './notification-queue';

const logger = createLogger('webhook-service');

export class WebhookService {
  /**
   * Send webhook notification
   */
  async sendWebhook(notification: NotificationJob): Promise<void> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response: AxiosResponse = await axios.post(notification.recipient, {
          id: notification.id,
          type: notification.type,
          timestamp: new Date().toISOString(),
          subject: notification.subject,
          message: notification.message,
          data: notification.data,
        }, {
          timeout: 10000, // 10 seconds timeout
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Spotex-Notification-Service/1.0',
            'X-Webhook-Attempt': attempt.toString(),
          },
        });

        logger.info('Webhook sent successfully', {
          notificationId: notification.id,
          url: notification.recipient,
          statusCode: response.status,
          attempt,
        });

        return; // Success, exit retry loop

      } catch (error) {
        lastError = error as Error;
        logger.warn('Webhook attempt failed', {
          notificationId: notification.id,
          url: notification.recipient,
          attempt,
          error: (error as Error).message,
        });

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    // All retries failed
    logger.error('Webhook failed after all retries', {
      notificationId: notification.id,
      url: notification.recipient,
      error: lastError?.message,
    });
    throw lastError;
  }

  /**
   * Test webhook endpoint
   */
  async testWebhook(url: string): Promise<void> {
    const testNotification: NotificationJob = {
      id: 'test-webhook',
      type: 'webhook',
      recipient: url,
      message: 'This is a test webhook from Spotex Platform.',
      data: {
        test: true,
        timestamp: new Date().toISOString(),
      },
    };

    await this.sendWebhook(testNotification);
  }
}
