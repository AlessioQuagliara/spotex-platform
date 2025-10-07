/**
 * @fileoverview Ticket Routes
 * @principle KISS - Simple ticket management endpoints with SLA
 */

import { Router } from 'express';
import { requireAuth, requireTenantId, asyncHandler } from '../middleware';
import { PrismaTicketRepository, calculateSLAResponseDeadline, calculateSLAResolutionDeadline } from '@spotex/shared';

const router = Router();
const ticketRepo = new PrismaTicketRepository();

// ==================== TICKET CRUD ====================

/**
 * GET /api/tickets?tenantId=xxx
 * List all tickets for tenant
 */
router.get(
  '/',
  requireAuth(['ticket:read']),
  requireTenantId,
  asyncHandler(async (req: any, res: any) => {
    const tenantId = req.tenantId;
    const { status, priority } = req.query;
    
    const filter: any = { tenantId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    
    const tickets = await ticketRepo.find(filter);
    
    res.json({
      success: true,
      data: tickets,
      count: tickets.length,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * GET /api/tickets/:id?tenantId=xxx
 * Get single ticket
 */
router.get(
  '/:id',
  requireAuth(['ticket:read']),
  requireTenantId,
  asyncHandler(async (req: any, res: any) => {
    const ticket = await ticketRepo.findOne(req.params.id);
    
    if (!ticket || ticket.tenantId !== req.tenantId) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Ticket not found',
        },
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: ticket,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * POST /api/tickets?tenantId=xxx
 * Create new ticket with automatic SLA calculation
 */
router.post(
  '/',
  requireAuth(['ticket:write']),
  requireTenantId,
  asyncHandler(async (req: any, res: any) => {
    const ticketData = {
      ...req.body,
      tenantId: req.tenantId,
      createdBy: req.user?.userId || req.body.createdBy,
      status: 'open',
      // Calculate SLA deadlines automatically based on priority
      slaResponseDeadline: calculateSLAResponseDeadline(req.body.priority || 'medium'),
      slaResolutionDeadline: calculateSLAResolutionDeadline(req.body.priority || 'medium'),
    };
    
    const ticket = await ticketRepo.create(ticketData);
    
    // Trigger notification (mock for now)
    console.log(`[MOCK] Notifying assigned agent for ticket: ${ticket.id}`);
    
    res.status(201).json({
      success: true,
      data: ticket,
      message: 'Ticket created with SLA tracking',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * PUT /api/tickets/:id?tenantId=xxx
 * Update ticket
 */
router.put(
  '/:id',
  requireAuth(['ticket:write']),
  requireTenantId,
  asyncHandler(async (req: any, res: any) => {
    const ticket = await ticketRepo.update(req.params.id, req.body);
    
    res.json({
      success: true,
      data: ticket,
      timestamp: new Date().toISOString(),
    });
  })
);

// ==================== TICKET SPECIFIC OPERATIONS ====================

/**
 * POST /api/tickets/:id/assign?tenantId=xxx
 * Assign ticket to user
 */
router.post(
  '/:id/assign',
  requireAuth(['ticket:write']),
  requireTenantId,
  asyncHandler(async (req: any, res: any) => {
    const { assigneeId } = req.body;
    const ticket = await ticketRepo.update(req.params.id, {
      assignedTo: assigneeId,
    });
    
    console.log(`[MOCK] Notifying assignee ${assigneeId} for ticket ${req.params.id}`);
    
    res.json({
      success: true,
      data: ticket,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * POST /api/tickets/:id/escalate?tenantId=xxx
 * Escalate ticket priority
 */
router.post(
  '/:id/escalate',
  requireAuth(['ticket:write']),
  requireTenantId,
  asyncHandler(async (req: any, res: any) => {
    const currentTicket = await ticketRepo.findOne(req.params.id);
    if (!currentTicket) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Ticket not found' },
      });
    }
    
    // Escalate priority: low->medium->high->critical
    const priorityMap: any = { low: 'medium', medium: 'high', high: 'critical', critical: 'critical' };
    const newPriority = priorityMap[currentTicket.priority] || 'high';
    
    const ticket = await ticketRepo.update(req.params.id, {
      priority: newPriority,
      slaResponseDeadline: calculateSLAResponseDeadline(newPriority),
      slaResolutionDeadline: calculateSLAResolutionDeadline(newPriority),
    });
    
    console.log(`[MOCK] Ticket ${req.params.id} escalated to ${newPriority}`);
    
    res.json({
      success: true,
      data: ticket,
      message: `Ticket escalated to ${newPriority} priority`,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * GET /api/tickets/overdue?tenantId=xxx
 * Get overdue tickets (SLA breached)
 */
router.get(
  '/status/overdue',
  requireAuth(['ticket:read']),
  requireTenantId,
  asyncHandler(async (req: any, res: any) => {
    // Get all open tickets for tenant
    const allTickets = await ticketRepo.find({
      tenantId: req.tenantId,
      status: 'open',
    });
    
    // Filter tickets with breached SLA
    const now = new Date();
    const overdueTickets = allTickets.filter((ticket: any) => {
      return ticket.slaResolutionDeadline && new Date(ticket.slaResolutionDeadline) < now;
    });
    
    res.json({
      success: true,
      data: overdueTickets,
      count: overdueTickets.length,
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;
