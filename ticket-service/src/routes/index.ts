/**
 * @fileoverview Ticket Service Routes
 * @principle KISS - Simple, focused ticket endpoints
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware';
import { TicketController } from './ticket.controller';

const router = Router();
const ticketController = new TicketController();

// ==================== TICKET ENDPOINTS ====================

/**
 * GET /api/tickets
 * Get all tickets for tenant (with pagination)
 */
router.get('/tickets', asyncHandler(ticketController.getTickets.bind(ticketController)));

/**
 * GET /api/tickets/:id
 * Get ticket by ID
 */
router.get('/tickets/:id', asyncHandler(ticketController.getTicketById.bind(ticketController)));

/**
 * POST /api/tickets
 * Create new ticket
 */
router.post('/tickets', asyncHandler(ticketController.createTicket.bind(ticketController)));

/**
 * PUT /api/tickets/:id
 * Update ticket
 */
router.put('/tickets/:id', asyncHandler(ticketController.updateTicket.bind(ticketController)));

/**
 * DELETE /api/tickets/:id
 * Delete ticket (soft delete)
 */
router.delete('/tickets/:id', asyncHandler(ticketController.deleteTicket.bind(ticketController)));

/**
 * POST /api/tickets/:id/escalate
 * Escalate ticket to next level
 */
router.post('/tickets/:id/escalate', asyncHandler(ticketController.escalateTicket.bind(ticketController)));

/**
 * POST /api/tickets/:id/assign
 * Assign ticket to user
 */
router.post('/tickets/:id/assign', asyncHandler(ticketController.assignTicket.bind(ticketController)));

/**
 * POST /api/tickets/:id/close
 * Close ticket
 */
router.post('/tickets/:id/close', asyncHandler(ticketController.closeTicket.bind(ticketController)));

/**
 * GET /api/tickets/stats/sla
 * Get SLA statistics
 */
router.get('/tickets/stats/sla', asyncHandler(ticketController.getSLAStats.bind(ticketController)));

export default router;
