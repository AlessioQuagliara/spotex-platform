/**
 * @fileoverview Email Service - SMTP email notifications
 * @principle KISS - Simple email sending with templates
 */

import nodemailer from 'nodemailer';
import { createLogger } from '@spotex/shared';
import { NotificationJob } from './notification-queue';

const logger = createLogger('email-service');

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  /**
   * Send email notification
   */
  async sendEmail(notification: NotificationJob): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@spotexsrl.com',
        to: notification.recipient,
        subject: notification.subject || 'Notification from Spotex',
        html: this.renderTemplate(notification),
      };

      const info = await this.transporter.sendMail(mailOptions);

      logger.info('Email sent successfully', {
        notificationId: notification.id,
        recipient: notification.recipient,
        messageId: info.messageId,
      });
    } catch (error) {
      logger.error('Email send failed', {
        notificationId: notification.id,
        recipient: notification.recipient,
        error: (error as Error).message,
      });
      throw error;
    }
  }

  /**
   * Test email configuration
   */
  async testEmail(to: string): Promise<void> {
    const testNotification: NotificationJob = {
      id: 'test-email',
      type: 'email',
      recipient: to,
      subject: 'Test Email from Spotex',
      message: 'This is a test email to verify SMTP configuration.',
    };

    await this.sendEmail(testNotification);
  }

  // ==================== PRIVATE METHODS ====================

  private renderTemplate(notification: NotificationJob): string {
    // Simple template rendering - could be enhanced with Handlebars
    let html = notification.message;

    if (notification.data) {
      // Replace placeholders like {{name}} with data values
      Object.entries(notification.data).forEach(([key, value]) => {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
      });
    }

    // Wrap in basic HTML template
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${notification.subject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Spotex Platform</h1>
            </div>
            <div class="content">
              ${html}
            </div>
            <div class="footer">
              <p>This email was sent by Spotex SRL. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
