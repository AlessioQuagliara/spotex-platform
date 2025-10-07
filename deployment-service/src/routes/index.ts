/**
 * @fileoverview Deployment Service Routes
 * @principle KISS - Simple, focused deployment endpoints
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware';
import { DeploymentController } from './deployment.controller';

const router = Router();
const deploymentController = new DeploymentController();

// ==================== DEPLOYMENT ENDPOINTS ====================

/**
 * GET /api/deployments
 * Get all deployments for tenant
 */
router.get('/deployments', asyncHandler(deploymentController.getDeployments.bind(deploymentController)));

/**
 * GET /api/deployments/:id
 * Get deployment details
 */
router.get('/deployments/:id', asyncHandler(deploymentController.getDeployment.bind(deploymentController)));

/**
 * POST /api/deployments
 * Start new deployment
 */
router.post('/deployments', asyncHandler(deploymentController.createDeployment.bind(deploymentController)));
router.post("/test-deployments", asyncHandler(deploymentController.testDeployment.bind(deploymentController)));

/**
 * PUT /api/deployments/:id
 * Update deployment
 */
router.put('/deployments/:id', asyncHandler(deploymentController.updateDeployment.bind(deploymentController)));

/**
 * DELETE /api/deployments/:id
 * Cancel deployment
 */
router.delete('/deployments/:id', asyncHandler(deploymentController.cancelDeployment.bind(deploymentController)));

/**
 * POST /api/deployments/:id/retry
 * Retry failed deployment
 */
router.post('/deployments/:id/retry', asyncHandler(deploymentController.retryDeployment.bind(deploymentController)));

/**
 * GET /api/deployments/:id/logs
 * Get deployment logs
 */
router.get('/deployments/:id/logs', asyncHandler(deploymentController.getDeploymentLogs.bind(deploymentController)));

/**
 * POST /api/sites/:siteId/backup
 * Create site backup
 */
router.post('/sites/:siteId/backup', asyncHandler(deploymentController.createBackup.bind(deploymentController)));

/**
 * POST /api/sites/:siteId/restore
 * Restore site from backup
 */
router.post('/sites/:siteId/restore', asyncHandler(deploymentController.restoreBackup.bind(deploymentController)));

/**
 * GET /api/sites/:siteId/backups
 * Get site backups
 */
router.get('/sites/:siteId/backups', asyncHandler(deploymentController.getBackups.bind(deploymentController)));

export default router;
