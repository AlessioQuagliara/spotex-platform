/**
 * @fileoverview Agency Routes - Agency-specific operations and dashboard data
 * @principle KISS - Simple agency endpoints with tenant-specific data
 */

import { Router, Request, Response } from 'express';
import { PrismaTenantRepository } from '@spotex/shared';
import { PrismaSiteRepository } from '@spotex/shared';
import { PrismaTicketRepository } from '@spotex/shared';
import { PrismaDomainRepository } from '@spotex/shared';

const router = Router();
const tenantRepo = new PrismaTenantRepository();
const siteRepo = new PrismaSiteRepository();
const ticketRepo = new PrismaTicketRepository();
const domainRepo = new PrismaDomainRepository();

// Middleware to get tenant from auth (simplified for now)
const getTenantFromAuth = async (req: Request): Promise<any> => {
  // In real implementation, get from JWT token
  // For now, assume tenant ID from header or query param
  const tenantId = req.headers['x-tenant-id'] as string || req.query.tenantId as string;
  if (!tenantId) {
    throw new Error('Tenant ID required');
  }
  const tenants = await tenantRepo.find({ id: tenantId });
  if (tenants.length === 0) {
    throw new Error('Tenant not found');
  }
  return tenants[0];
};

// ==================== DASHBOARD ====================

router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const tenant = await getTenantFromAuth(req);

    // Get tenant-specific data
    const sites = await siteRepo.find({ tenantId: tenant.id });
    const tickets = await ticketRepo.find({ tenantId: tenant.id });
    const domains = await domainRepo.find({ tenantId: tenant.id });

    // Calculate metrics
    const totalClients = 1; // For agency, this would be sub-tenants if implemented
    const activeSites = sites.filter(s => s.status === 'active').length;
    const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
    const monthlyRevenue = tenant.tier === 'starter' ? 99 : tenant.tier === 'business' ? 199 : 399;

    // Site status breakdown
    const siteStatus = {
      active: sites.filter(s => s.status === 'active').length,
      deploying: sites.filter(s => s.status === 'deploying').length,
      error: sites.filter(s => s.status === 'error').length,
      suspended: sites.filter(s => s.status === 'suspended').length,
    };

    // Recent tickets
    const recentTickets = tickets
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(t => ({
        id: t.id,
        subject: t.subject,
        status: t.status,
        priority: t.priority,
        createdAt: t.createdAt
      }));

    // Revenue data (mock for now)
    const revenueData = [
      { month: 'Gen', amount: monthlyRevenue * 0.8 },
      { month: 'Feb', amount: monthlyRevenue * 0.9 },
      { month: 'Mar', amount: monthlyRevenue * 1.1 },
      { month: 'Apr', amount: monthlyRevenue * 1.0 },
      { month: 'Mag', amount: monthlyRevenue * 1.2 },
      { month: 'Giu', amount: monthlyRevenue * 1.1 },
    ];

    const dashboardData = {
      totalClients,
      activeSites,
      openTickets,
      monthlyRevenue,
      siteStatus,
      recentTickets,
      revenueData,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        tier: tenant.tier,
        status: tenant.status
      }
    };

    res.json({
      success: true,
      data: dashboardData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Agency dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nel caricamento del dashboard agenzia',
      timestamp: new Date().toISOString()
    });
  }
});

// ==================== CLIENTS (SUB-TENANTS) ====================

router.get('/clients', async (req: Request, res: Response) => {
  try {
    const tenant = await getTenantFromAuth(req);

    // For now, return empty array as sub-tenants not implemented yet
    // In future, would return sub-tenants of this agency
    const clients: any[] = [];

    res.json({
      success: true,
      data: clients,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Agency clients error:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nel caricamento dei clienti',
      timestamp: new Date().toISOString()
    });
  }
});

// ==================== SITES ====================

router.get('/sites', async (req: Request, res: Response) => {
  try {
    const tenant = await getTenantFromAuth(req);
    const { status, search } = req.query;

    let sites = await siteRepo.find({ tenantId: tenant.id });

    // Filter by status if provided
    if (status) {
      sites = sites.filter(s => s.status === status);
    }

    // Filter by search if provided
    if (search) {
      const searchTerm = search.toString().toLowerCase();
      sites = sites.filter(s =>
        s.name.toLowerCase().includes(searchTerm) ||
        s.domain.toLowerCase().includes(searchTerm)
      );
    }

    res.json({
      success: true,
      data: sites,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Agency sites error:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nel caricamento dei siti',
      timestamp: new Date().toISOString()
    });
  }
});

router.get('/sites/:id', async (req: Request, res: Response) => {
  try {
    const tenant = await getTenantFromAuth(req);
    const { id } = req.params;

    const sites = await siteRepo.find({ id, tenantId: tenant.id });
    if (sites.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Sito non trovato',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: sites[0],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Agency site detail error:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nel caricamento del sito',
      timestamp: new Date().toISOString()
    });
  }
});

// ==================== TICKETS ====================

router.get('/tickets', async (req: Request, res: Response) => {
  try {
    const tenant = await getTenantFromAuth(req);
    const { status, priority } = req.query;

    let tickets = await ticketRepo.find({ tenantId: tenant.id });

    // Filter by status if provided
    if (status) {
      tickets = tickets.filter(t => t.status === status);
    }

    // Filter by priority if provided
    if (priority) {
      tickets = tickets.filter(t => t.priority === priority);
    }

    res.json({
      success: true,
      data: tickets,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Agency tickets error:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nel caricamento dei ticket',
      timestamp: new Date().toISOString()
    });
  }
});

router.get('/tickets/:id', async (req: Request, res: Response) => {
  try {
    const tenant = await getTenantFromAuth(req);
    const { id } = req.params;

    const tickets = await ticketRepo.find({ id, tenantId: tenant.id });
    if (tickets.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Ticket non trovato',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: tickets[0],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Agency ticket detail error:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nel caricamento del ticket',
      timestamp: new Date().toISOString()
    });
  }
});

// ==================== SETTINGS ====================

router.get('/settings', async (req: Request, res: Response) => {
  try {
    const tenant = await getTenantFromAuth(req);

    const settings = {
      id: tenant.id,
      name: tenant.name,
      domain: tenant.domain,
      tier: tenant.tier,
      status: tenant.status,
      whiteLabelConfig: tenant.whiteLabelConfig,
      limits: tenant.limits,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt
    };

    res.json({
      success: true,
      data: settings,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Agency settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nel caricamento delle impostazioni',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;