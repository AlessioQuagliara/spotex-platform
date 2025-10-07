/**
 * @fileoverview Notification Service Routes
 * @principle KISS - Simple, focused notification endpoints
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware';
import { NotificationController } from './notification.controller';

const router = Router();
const notificationController = new NotificationController();

// ==================== NOTIFICATION ENDPOINTS ====================

/**
 * GET /api/notifications
 * Get notifications for user/tenant
 */
router.get('/notifications', asyncHandler(notificationController.getNotifications.bind(notificationController)));

/**
 * GET /api/notifications/:id
 * Get notification details
 */
router.get('/notifications/:id', asyncHandler(notificationController.getNotification.bind(notificationController)));

/**
 * POST /api/notifications
 * Send new notification
 */
router.post('/notifications', asyncHandler(notificationController.sendNotification.bind(notificationController)));

/**
 * POST /api/notifications/bulk
 * Send bulk notifications
 */
router.post('/notifications/bulk', asyncHandler(notificationController.sendBulkNotifications.bind(notificationController)));

/**
 * PUT /api/notifications/:id/read
 * Mark notification as read
 */
router.put('/notifications/:id/read', asyncHandler(notificationController.markAsRead.bind(notificationController)));

/**
 * GET /api/templates
 * Get notification templates
 */
router.get('/templates', asyncHandler(notificationController.getTemplates.bind(notificationController)));

/**
 * POST /api/templates
 * Create notification template
 */
router.post('/templates', asyncHandler(notificationController.createTemplate.bind(notificationController)));

/**
 * PUT /api/templates/:id
 * Update notification template
 */
router.put('/templates/:id', asyncHandler(notificationController.updateTemplate.bind(notificationController)));

/**
 * DELETE /api/templates/:id
 * Delete notification template
 */
router.delete('/templates/:id', asyncHandler(notificationController.deleteTemplate.bind(notificationController)));

/**
 * POST /api/webhooks/test
 * Test webhook endpoint
 */
router.post('/webhooks/test', asyncHandler(notificationController.testWebhook.bind(notificationController)));

export default router;
