/**
 * @fileoverview Tenant Routes
 * @principle KISS - RESTful endpoints for tenant management
 */

import { Router } from 'express';
import { requireAuth, requireTenantId, asyncHandler } from '../middleware';
import { PrismaTenantRepository } from '@spotex/shared';

const router = Router();
const tenantRepo = new PrismaTenantRepository();

// ==================== PUBLIC REGISTRATION ====================

/**
 * POST /api/tenants/register
 * Public tenant registration (no auth required)
 */
router.post(
  '/register',
  asyncHandler(async (req: any, res: any) => {
    const { name, domain, tier, adminEmail, adminPassword, phone } = req.body;

    // Validate required fields
    if (!name || !domain || !tier || !adminEmail || !adminPassword) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Check if domain already exists
    const existingTenants = await tenantRepo.find({ domain });
    if (existingTenants.length > 0) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DOMAIN_EXISTS',
          message: 'Domain already registered',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Create tenant
    const tenant = await tenantRepo.create({
      name,
      domain,
      tier,
      status: 'trial',
      adminEmail,
      phone,
      // Add default white label config and limits
      whiteLabelConfig: {
        logo: null,
        favicon: null,
        colors: {
          primary: '#3B82F6',
          secondary: '#6366F1',
        },
        customDomains: [],
        emailFrom: adminEmail,
        supportEmail: adminEmail,
        companyName: name,
      },
      limits: {
        maxSites: tier === 'starter' ? 5 : tier === 'business' ? 25 : 100,
        maxUsers: tier === 'starter' ? 3 : tier === 'business' ? 10 : 50,
        maxStorage: tier === 'starter' ? 5 : tier === 'business' ? 25 : 100, // GB
        maxBandwidth: tier === 'starter' ? 50 : tier === 'business' ? 250 : 1000, // GB per month
        maxTicketsPerMonth: tier === 'starter' ? 10 : tier === 'business' ? 50 : 200,
      },
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days trial
    });

    res.status(201).json({
      success: true,
      data: tenant,
      message: 'Tenant registered successfully',
      timestamp: new Date().toISOString(),
    });
  })
);

// ==================== TENANT CRUD ====================

/**
 * GET /api/tenants
 * List all tenants (super_admin only)
 */
router.get(
  '/',
  requireAuth(['tenant:read']),
  asyncHandler(async (req: any, res: any) => {
    const tenants = await tenantRepo.find({});
    res.json({
      success: true,
      data: tenants,
      count: tenants.length,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * GET /api/tenants/:id
 * Get single tenant
 */
router.get(
  '/:id',
  requireAuth(['tenant:read']),
  asyncHandler(async (req: any, res: any) => {
    const tenant = await tenantRepo.findOne(req.params.id);
    
    if (!tenant) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Tenant not found',
        },
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: tenant,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * POST /api/tenants
 * Create new tenant (super_admin only)
 */
router.post(
  '/',
  requireAuth(['tenant:write']),
  asyncHandler(async (req: any, res: any) => {
    const tenant = await tenantRepo.create(req.body);
    
    res.status(201).json({
      success: true,
      data: tenant,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * PUT /api/tenants/:id
 * Update tenant
 */
router.put(
  '/:id',
  requireAuth(['tenant:write']),
  asyncHandler(async (req: any, res: any) => {
    const tenant = await tenantRepo.update(req.params.id, req.body);
    
    res.json({
      success: true,
      data: tenant,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * DELETE /api/tenants/:id
 * Delete tenant (super_admin only)
 */
router.delete(
  '/:id',
  requireAuth(['tenant:delete']),
  asyncHandler(async (req: any, res: any) => {
    await tenantRepo.delete(req.params.id);
    
    res.json({
      success: true,
      data: { message: 'Tenant deleted successfully' },
      timestamp: new Date().toISOString(),
    });
  })
);

// ==================== TENANT SPECIFIC OPERATIONS ====================

/**
 * GET /api/tenants/:id/stats
 * Get tenant statistics
 */
router.get(
  '/:id/stats',
  requireAuth(['tenant:read']),
  asyncHandler(async (req: any, res: any) => {
    const tenant = await tenantRepo.findOne(req.params.id);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Tenant not found' },
      });
    }

    const stats = {
      users: tenant._count?.users || 0,
      sites: tenant._count?.sites || 0,
      tickets: tenant._count?.tickets || 0,
    };
    
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * PUT /api/tenants/:id/white-label
 * Update white-label configuration
 */
router.put(
  '/:id/white-label',
  requireAuth(['tenant:write']),
  asyncHandler(async (req: any, res: any) => {
    const tenant = await tenantRepo.update(req.params.id, {
      whiteLabelConfig: req.body,
    });
    
    res.json({
      success: true,
      data: tenant,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * POST /api/tenants/:id/upgrade
 * Upgrade tenant tier
 */
router.post(
  '/:id/upgrade',
  requireAuth(['tenant:write']),
  asyncHandler(async (req: any, res: any) => {
    const { tier } = req.body;
    const tenant = await tenantRepo.update(req.params.id, { tier });
    
    res.json({
      success: true,
      data: tenant,
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;
