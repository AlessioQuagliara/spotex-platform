/**
 * @fileoverview Admin Routes - Administrative operations and dashboard data
 * @principle KISS - Simple admin endpoints with real data
 */

import { Router, Request, Response } from 'express';
import { PrismaTenantRepository } from '@spotex/shared';
import { PrismaSiteRepository } from '@spotex/shared';
import { PrismaTicketRepository } from '@spotex/shared';
import { PrismaDomainRepository } from '@spotex/shared';
import type { Tenant } from '@spotex/shared';

const router = Router();
const tenantRepo = new PrismaTenantRepository();
const siteRepo = new PrismaSiteRepository();
const ticketRepo = new PrismaTicketRepository();
const domainRepo = new PrismaDomainRepository();

// ==================== DASHBOARD ====================

router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    // Get real data from database
    const [tenants, sites, tickets, domains] = await Promise.all([
      tenantRepo.find({}),
      siteRepo.find({}),
      ticketRepo.find({}),
      domainRepo.find({})
    ]);

    // Calculate metrics
    const totalAgencies = tenants.length;
    const activeAgencies = tenants.filter(t => t.status === 'active').length;
    const totalSites = sites.length;
    const activeSites = sites.filter(s => s.status === 'active').length;
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
    const totalDomains = domains.length;
    const expiringDomains = domains.filter(d => {
      const daysUntilExpiry = Math.ceil((new Date(d.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30;
    }).length;

    // Mock revenue for now (would come from billing system)
    const monthlyRevenue = totalAgencies * 99; // €99 per agency per month

    // Recent incidents (tickets with high priority or overdue)
    const recentIncidents = tickets
      .filter(t => t.priority === 'critical' || t.priority === 'high')
      .slice(0, 5)
      .map(t => ({
        id: t.id,
        title: t.subject,
        severity: t.priority === 'critical' ? 'critical' : 'high',
        status: t.status,
        created_at: t.createdAt
      }));

    // Top agencies by site count
    const agencyStats = tenants.map(tenant => ({
      id: tenant.id,
      name: tenant.name,
      sites_count: sites.filter(s => s.tenantId === tenant.id).length,
      tickets_count: tickets.filter(t => t.tenantId === tenant.id).length,
      status: tenant.status
    })).sort((a, b) => b.sites_count - a.sites_count).slice(0, 5);

    const dashboardData = {
      metrics: {
        total_agencies: totalAgencies,
        active_agencies: activeAgencies,
        total_sites: totalSites,
        active_sites: activeSites,
        total_tickets: totalTickets,
        open_tickets: openTickets,
        total_domains: totalDomains,
        expiring_domains: expiringDomains,
        system_health: openTickets > 10 ? 'warning' : 'healthy'
      },
      revenue: {
        monthly_revenue: monthlyRevenue,
        growth_percentage: 15 // Mock growth
      },
      recent_incidents: recentIncidents,
      top_agencies: agencyStats
    };

    res.json({
      success: true,
      data: dashboardData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nel caricamento del dashboard',
      timestamp: new Date().toISOString()
    });
  }
});

// ==================== AGENCIES MANAGEMENT ====================

router.get('/agencies', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    let tenants = await tenantRepo.find({});

    // Filter by status if provided
    if (status) {
      tenants = tenants.filter(t => t.status === status);
    }

    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedTenants = tenants.slice(startIndex, endIndex);

    // Add site and ticket counts
    const agencies = await Promise.all(paginatedTenants.map(async (tenant) => {
      const sites = await siteRepo.find({ tenantId: tenant.id });
      const tickets = await ticketRepo.find({ tenantId: tenant.id });

      return {
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain,
        tier: tenant.tier,
        status: tenant.status,
        sites_count: sites.length,
        tickets_count: tickets.length,
        created_at: tenant.createdAt,
        updated_at: tenant.updatedAt
      };
    }));

    res.json({
      success: true,
      data: agencies,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: tenants.length,
        pages: Math.ceil(tenants.length / Number(limit))
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Agencies error:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nel caricamento delle agenzie',
      timestamp: new Date().toISOString()
    });
  }
});

router.get('/agencies/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tenant = await tenantRepo.find({ id });
    if (!tenant || tenant.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Agenzia non trovata',
        timestamp: new Date().toISOString()
      });
    }

    // Get related data
    const sites = await siteRepo.find({ tenantId: id });
    const tickets = await ticketRepo.find({ tenantId: id });
    const domains = await domainRepo.find({ tenantId: id });

    const agency = {
      ...tenant,
      sites_count: sites.length,
      tickets_count: tickets.length,
      domains_count: domains.length,
      sites: sites.slice(0, 5), // Recent sites
      tickets: tickets.slice(0, 5) // Recent tickets
    };

    res.json({
      success: true,
      data: agency,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Agency detail error:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nel caricamento dell\'agenzia',
      timestamp: new Date().toISOString()
    });
  }
});

router.put('/agencies/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedTenant = await tenantRepo.update(id, updateData);

    res.json({
      success: true,
      data: updatedTenant,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Agency update error:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nell\'aggiornamento dell\'agenzia',
      timestamp: new Date().toISOString()
    });
  }
});

router.post('/agencies/:id/suspend', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedTenant = await tenantRepo.update(id, { status: 'suspended' });

    res.json({
      success: true,
      data: updatedTenant,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Agency suspend error:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nella sospensione dell\'agenzia',
      timestamp: new Date().toISOString()
    });
  }
});

router.post('/agencies/:id/activate', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedTenant = await tenantRepo.update(id, { status: 'active' });

    res.json({
      success: true,
      data: updatedTenant,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Agency activate error:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nell\'attivazione dell\'agenzia',
      timestamp: new Date().toISOString()
    });
  }
});

// ==================== SYSTEM MONITORING ====================

router.get('/metrics', async (req: Request, res: Response) => {
  try {
    // System metrics (simplified)
    const metrics = {
      uptime: process.uptime(),
      memory_usage: process.memoryUsage(),
      cpu_usage: process.cpuUsage(),
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Metrics error:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nel caricamento delle metriche',
      timestamp: new Date().toISOString()
    });
  }
});

router.get('/performance', async (req: Request, res: Response) => {
  try {
    const { period = '24h' } = req.query;

    // Mock performance data (would come from monitoring system)
    const performanceData = {
      period,
      response_times: {
        avg: 245,
        p95: 450,
        p99: 800
      },
      throughput: {
        requests_per_second: 125,
        error_rate: 0.02
      },
      database: {
        connection_pool_usage: 0.75,
        query_latency: 15
      }
    };

    res.json({
      success: true,
      data: performanceData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Performance error:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nel caricamento dei dati performance',
      timestamp: new Date().toISOString()
    });
  }
});

// ==================== INCIDENTS ====================

router.get('/incidents', async (req: Request, res: Response) => {
  try {
    const { status, severity } = req.query;

    let tickets = await ticketRepo.find({});

    // Filter by status and severity
    if (status) {
      tickets = tickets.filter(t => t.status === status);
    }
    if (severity) {
      tickets = tickets.filter(t => t.priority === severity);
    }

    // Convert to incident format
    const incidents = tickets.map(t => ({
      id: t.id,
      title: t.subject,
      description: t.description,
      severity: t.priority,
      status: t.status,
      tenant_id: t.tenantId,
      assigned_to: t.assignedTo,
      created_at: t.createdAt,
      updated_at: t.updatedAt,
      sla_deadline: t.slaDeadline
    }));

    res.json({
      success: true,
      data: incidents,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Incidents error:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nel caricamento degli incidenti',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;