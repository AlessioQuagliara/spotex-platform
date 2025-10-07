/**
 * @fileoverview Direct Prisma Test Routes
 * @description Test routes that use Prisma directly for immediate database access
 */

import { Router } from 'express';
import { getPrismaClient } from '@spotex/shared';

const router = Router();
const prisma = getPrismaClient();

/**
 * GET /api/test/tenants
 * Direct query to test database connection
 */
router.get('/tenants', async (req: any, res: any) => {
  try {
    const tenants = await prisma.tenant.findMany({
      include: {
        users: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        sites: {
          select: {
            id: true,
            name: true,
            domain: true,
            status: true,
          },
        },
        _count: {
          select: {
            users: true,
            sites: true,
            tickets: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: tenants,
      count: tenants.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/test/sites
 * Get all WordPress sites with relationships
 */
router.get('/sites', async (req: any, res: any) => {
  try {
    const sites = await prisma.wordPressSite.findMany({
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
          },
        },
        domains: true,
        tickets: {
          where: {
            status: {
              in: ['open', 'in_progress'],
            },
          },
        },
      },
    });

    res.json({
      success: true,
      data: sites,
      count: sites.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/test/tickets
 * Get all tickets with full relationships
 */
router.get('/tickets', async (req: any, res: any) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        assignee: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        site: {
          select: {
            id: true,
            name: true,
            domain: true,
          },
        },
        messages: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: tickets,
      count: tickets.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/test/domains
 * Get all domains with SSL status
 */
router.get('/domains', async (req: any, res: any) => {
  try {
    const domains = await prisma.domain.findMany({
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
          },
        },
        site: {
          select: {
            id: true,
            name: true,
            domain: true,
          },
        },
      },
      orderBy: {
        expiresAt: 'asc',
      },
    });

    res.json({
      success: true,
      data: domains,
      count: domains.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/test/users
 * Get all users
 */
router.get('/users', async (req: any, res: any) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Remove password hashes from response
    const sanitizedUsers = users.map(({ passwordHash, ...user }) => user);

    res.json({
      success: true,
      data: sanitizedUsers,
      count: sanitizedUsers.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/test/stats
 * Get platform statistics
 */
router.get('/stats', async (req: any, res: any) => {
  try {
    const [
      totalTenants,
      totalUsers,
      totalSites,
      totalTickets,
      totalDomains,
      openTickets,
      activeSites,
    ] = await Promise.all([
      prisma.tenant.count(),
      prisma.user.count(),
      prisma.wordPressSite.count(),
      prisma.ticket.count(),
      prisma.domain.count(),
      prisma.ticket.count({ where: { status: 'open' } }),
      prisma.wordPressSite.count({ where: { status: 'active' } }),
    ]);

    res.json({
      success: true,
      data: {
        tenants: {
          total: totalTenants,
        },
        users: {
          total: totalUsers,
        },
        sites: {
          total: totalSites,
          active: activeSites,
        },
        tickets: {
          total: totalTickets,
          open: openTickets,
        },
        domains: {
          total: totalDomains,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * POST /api/test/sites
 * Create test site directly in database
 */
router.post('/sites', async (req: any, res: any) => {
  try {
    const site = await prisma.wordPressSite.create({
      data: {
        tenantId: req.body.tenantId,
        name: req.body.name,
        domain: req.body.domain,
        wordpressVersion: req.body.wordpressVersion || '6.4.2',
        phpVersion: req.body.phpVersion || '8.2',
        adminUrl: `https://${req.body.domain}/wp-admin`,
        adminUsername: req.body.adminUsername || 'admin',
        status: req.body.status || 'completed',
        deployedAt: req.body.status === 'completed' ? new Date() : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      data: site,
      message: 'Test site created successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/test/health
 * Database health check
 */
router.get('/health', async (req: any, res: any) => {
  try {
    // Simple query to test connection - use count instead of raw query
    const count = await prisma.tenant.count();

    res.json({
      success: true,
      data: {
        database: 'connected',
        tenantsCount: count,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/test/tickets
 * Get all tickets for testing
 */
router.get('/tickets', async (req: any, res: any) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        assignee: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        site: {
          select: {
            id: true,
            name: true,
            domain: true,
          },
        },
        messages: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: tickets,
      count: tickets.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * POST /api/test/tickets
 * Direct ticket creation for testing
 */
router.post('/tickets', async (req: any, res: any) => {
  try {
    const { tenantId, subject, description, priority = 'medium', category, wordPressSiteId } = req.body;

    if (!tenantId || !subject || !description || !category) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields: tenantId, subject, description, category',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Find or create a user for this tenant
    let user = await prisma.user.findFirst({
      where: { tenantId, role: 'admin' },
    });

    if (!user) {
      // Create a test admin user for this tenant
      user = await prisma.user.create({
        data: {
          tenantId,
          email: `admin-${tenantId}@test.local`,
          firstName: 'Test',
          lastName: 'Admin',
          role: 'admin',
          status: 'active',
          passwordHash: 'test-hash', // Not used for testing
        },
      });
    }

    const ticket = await prisma.ticket.create({
      data: {
        tenantId,
        subject,
        description,
        priority,
        category,
        createdBy: user.id,
        wordPressSiteId,
        status: 'open',
      },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
        site: wordPressSiteId ? {
          select: {
            id: true,
            name: true,
            domain: true,
          },
        } : false,
      },
    });

    res.status(201).json({
      success: true,
      data: ticket,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
