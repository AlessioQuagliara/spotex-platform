/**
 * @fileoverview Domain Routes - Domain management with SSL tracking
 * @principle KISS - RESTful endpoints for domain CRUD + SSL
 */

import { Router } from 'express';
import { requireAuth, asyncHandler } from '../middleware';
import { PrismaDomainRepository } from '@spotex/shared';

const router = Router();
const domainRepo = new PrismaDomainRepository();

// ==================== DOMAIN CRUD ====================

/**
 * GET /api/domains
 * List domains (filtered by tenantId if provided)
 */
router.get(
  '/',
  requireAuth(['domain:read']),
  asyncHandler(async (req: any, res: any) => {
    const { tenantId } = req.query;
    
    const filter: any = {};
    if (tenantId) {
      filter.tenantId = tenantId;
    }
    
    const domains = await domainRepo.find(filter);
    
    res.json({
      success: true,
      data: domains,
      count: domains.length,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * GET /api/domains/:id
 * Get single domain with SSL details
 */
router.get(
  '/:id',
  requireAuth(['domain:read']),
  asyncHandler(async (req: any, res: any) => {
    const domain = await domainRepo.findOne(req.params.id);
    
    if (!domain) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Domain not found',
        },
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: domain,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * POST /api/domains
 * Register new domain
 */
router.post(
  '/',
  requireAuth(['domain:write']),
  asyncHandler(async (req: any, res: any) => {
    const domainData = {
      ...req.body,
      status: 'pending',
      sslStatus: 'pending',
      registeredAt: new Date(),
      expiresAt: req.body.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year default
    };
    
    const domain = await domainRepo.create(domainData);
    
    // Trigger SSL provisioning (mock for now)
    console.log(`[MOCK] Provisioning SSL for domain: ${domain.name}`);
    
    res.status(201).json({
      success: true,
      data: domain,
      message: 'Domain registration initiated',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * PUT /api/domains/:id
 * Update domain configuration
 */
router.put(
  '/:id',
  requireAuth(['domain:write']),
  asyncHandler(async (req: any, res: any) => {
    const domain = await domainRepo.update(req.params.id, req.body);
    
    res.json({
      success: true,
      data: domain,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * DELETE /api/domains/:id
 * Delete domain
 */
router.delete(
  '/:id',
  requireAuth(['domain:write']),
  asyncHandler(async (req: any, res: any) => {
    await domainRepo.delete(req.params.id);
    
    res.json({
      success: true,
      data: { message: 'Domain deleted successfully' },
      timestamp: new Date().toISOString(),
    });
  })
);

// ==================== SSL OPERATIONS ====================

/**
 * POST /api/domains/:id/ssl/renew
 * Renew SSL certificate
 */
router.post(
  '/:id/ssl/renew',
  requireAuth(['domain:write']),
  asyncHandler(async (req: any, res: any) => {
    const domain = await domainRepo.findOne(req.params.id);
    
    if (!domain) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Domain not found' },
      });
    }

    // Mock SSL renewal
    console.log(`[MOCK] Renewing SSL for domain: ${domain.name}`);
    
    await domainRepo.update(req.params.id, {
      sslStatus: 'active',
    });
    
    res.json({
      success: true,
      data: { message: 'SSL renewal initiated' },
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * GET /api/domains/expiring
 * Get domains expiring soon (within 30 days)
 */
router.get(
  '/status/expiring',
  requireAuth(['domain:read']),
  asyncHandler(async (req: any, res: any) => {
    const { tenantId } = req.query;
    
    const allDomains = await domainRepo.find({ tenantId });
    
    // Filter domains expiring within 30 days
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const expiringDomains = allDomains.filter((domain: any) => {
      return domain.expiresAt && new Date(domain.expiresAt) < thirtyDaysFromNow;
    });
    
    res.json({
      success: true,
      data: expiringDomains,
      count: expiringDomains.length,
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;
