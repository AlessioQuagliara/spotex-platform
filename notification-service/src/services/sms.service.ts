/**
 * @fileoverview SMS Service - Twilio SMS notifications
 * @principle KISS - Simple SMS sending
 */

import twilio from 'twilio';
import { createLogger } from '@spotex/shared';
import { NotificationJob } from './notification-queue';

const logger = createLogger('sms-service');

export class SmsService {
  private client!: twilio.Twilio;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      logger.warn('Twilio credentials not configured, SMS service disabled');
      return;
    }

    this.client = twilio(accountSid, authToken);
  }

  /**
   * Send SMS notification
   */
  async sendSms(notification: NotificationJob): Promise<void> {
    try {
      if (!this.client) {
        throw new Error('SMS service not configured');
      }

      const message = await this.client.messages.create({
        body: notification.message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: notification.recipient,
      });

      logger.info('SMS sent successfully', {
        notificationId: notification.id,
        recipient: notification.recipient,
        messageSid: message.sid,
      });
    } catch (error) {
      logger.error('SMS send failed', {
        notificationId: notification.id,
        recipient: notification.recipient,
        error: (error as Error).message,
      });
      throw error;
    }
  }

  /**
   * Test SMS configuration
   */
  async testSms(to: string): Promise<void> {
    const testNotification: NotificationJob = {
      id: 'test-sms',
      type: 'sms',
      recipient: to,
      message: 'This is a test SMS from Spotex Platform.',
    };

    await this.sendSms(testNotification);
  }
}
