/**
 * @fileoverview Domain Service Routes
 * @principle KISS - Simple, focused domain endpoints
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware';
import { DomainController } from './domain.controller';

const router = Router();
const domainController = new DomainController();

// ==================== DOMAIN ENDPOINTS ====================

/**
 * GET /api/domains
 * Get all domains for tenant
 */
router.get('/domains', asyncHandler(domainController.getDomains.bind(domainController)));

/**
 * GET /api/domains/:domain
 * Get domain details
 */
router.get('/domains/:domain', asyncHandler(domainController.getDomain.bind(domainController)));

/**
 * POST /api/domains
 * Register new domain
 */
router.post('/domains', asyncHandler(domainController.registerDomain.bind(domainController)));

/**
 * PUT /api/domains/:domain
 * Update domain configuration
 */
router.put('/domains/:domain', asyncHandler(domainController.updateDomain.bind(domainController)));

/**
 * DELETE /api/domains/:domain
 * Remove domain
 */
router.delete('/domains/:domain', asyncHandler(domainController.deleteDomain.bind(domainController)));

/**
 * POST /api/domains/:domain/verify
 * Verify domain ownership
 */
router.post('/domains/:domain/verify', asyncHandler(domainController.verifyDomain.bind(domainController)));

/**
 * POST /api/domains/:domain/ssl
 * Generate SSL certificate
 */
router.post('/domains/:domain/ssl', asyncHandler(domainController.generateSSL.bind(domainController)));

/**
 * GET /api/domains/:domain/ssl
 * Get SSL certificate status
 */
router.get('/domains/:domain/ssl', asyncHandler(domainController.getSSLStatus.bind(domainController)));

/**
 * POST /api/domains/:domain/dns
 * Update DNS records
 */
router.post('/domains/:domain/dns', asyncHandler(domainController.updateDNS.bind(domainController)));

/**
 * GET /api/domains/:domain/dns
 * Get DNS records
 */
router.get('/domains/:domain/dns', asyncHandler(domainController.getDNSRecords.bind(domainController)));

export default router;
