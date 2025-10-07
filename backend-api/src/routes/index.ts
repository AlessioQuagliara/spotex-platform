/**
 * @fileoverview Central Router - All API routes
 * @principle DRY - Single routing configuration
 */

import { Router } from 'express';
import tenantRoutes from './tenants';
import userRoutes from './users';
import siteRoutes from './sites';
import ticketRoutes from './tickets';
import domainRoutes from './domains';
import adminRoutes from './admin';
import agencyRoutes from './agency';
import testRoutes from './test';

const router = Router();

// ==================== ROUTE MOUNTING ====================

router.use('/tenants', tenantRoutes);
router.use('/users', userRoutes);
router.use('/sites', siteRoutes);
router.use('/tickets', ticketRoutes);
router.use('/domains', domainRoutes);
router.use('/admin', adminRoutes);
router.use('/agency', agencyRoutes);

// Test routes (direct Prisma access)
router.use('/test', testRoutes);

// ==================== API INFO ====================

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Spotex Platform API',
      version: '1.0.0',
      endpoints: {
        tenants: '/api/tenants',
        users: '/api/users',
        sites: '/api/sites',
        tickets: '/api/tickets',
        domains: '/api/domains',
        admin: '/api/admin (Administrative operations and dashboard)',
        agency: '/api/agency (Agency-specific operations and dashboard)',
        test: '/api/test (Direct database access for testing)',
      },
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
