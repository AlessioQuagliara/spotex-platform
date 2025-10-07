/**
 * @fileoverview Ticket Controller - Business logic for ticket management
 * @principle KISS - Simple, focused ticket operations
 * @principle DRY - Reusable ticket logic
 */

import { Request, Response } from 'express';
import {
  Ticket,
  TicketStatus,
  TicketPriority,
  TicketType,
  ServiceResponse,
  createLogger,
  generateRandomString,
  calculateSLABreach,
  getSLATargetHours,
} from '@spotex/shared';

const logger = createLogger('ticket-controller');

export class TicketController {
  /**
   * Get all tickets with pagination and filtering
   */
  async getTickets(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        priority,
        type,
        tenant_id,
        assigned_to,
      } = req.query;

      // Build filter object
      const filters: any = {};
      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (type) filters.type = type;
      if (tenant_id) filters.tenant_id = tenant_id;
      if (assigned_to) filters.assigned_to = assigned_to;

      // Placeholder - would use TicketService
      const tickets = await this.findTickets(filters, {
        page: Number(page),
        limit: Number(limit),
      });

      const total = await this.countTickets(filters);

      res.json(ServiceResponse.success({
        tickets,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      }));
    } catch (error) {
      logger.error('Get tickets error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Failed to retrieve tickets'));
    }
  }

  /**
   * Get ticket by ID
   */
  async getTicketById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const ticket = await this.findTicketById(id);
      if (!ticket) {
        res.status(404).json(ServiceResponse.error('NOT_FOUND', 'Ticket not found'));
        return;
      }

      res.json(ServiceResponse.success(ticket));
    } catch (error) {
      logger.error('Get ticket by ID error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Failed to retrieve ticket'));
    }
  }

  /**
   * Create new ticket
   */
  async createTicket(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      // Validate required fields
      if (!data.title || !data.description || !data.type || !data.priority) {
        res.status(400).json(ServiceResponse.error('VALIDATION_ERROR', 'Title, description, type, and priority are required'));
        return;
      }

      // Calculate SLA target
      const slaTargetHours = getSLATargetHours(data.priority, data.type);
      const slaDeadline = new Date(Date.now() + slaTargetHours * 60 * 60 * 1000);

      const ticket: Ticket = {
        id: generateRandomString(16),
        tenant_id: data.tenant_id || 'system',
        title: data.title,
        subject: data.title, // Use title as subject for now
        description: data.description,
        type: data.type,
        priority: data.priority,
        category: data.category || 'general',
        status: 'open',
        created_by: data.created_by,
        assigned_to: undefined,
        sla_deadline: slaDeadline.toISOString(),
        sla_breached: false,
        escalation_level: 1,
        tags: data.tags || [],
        metadata: data.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save ticket (placeholder)
      const savedTicket = await this.saveTicket(ticket);

      logger.info('Ticket created', { ticketId: ticket.id, tenantId: ticket.tenant_id });

      res.status(201).json(ServiceResponse.success(savedTicket));
    } catch (error) {
      logger.error('Create ticket error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Failed to create ticket'));
    }
  }

  /**
   * Update ticket
   */
  async updateTicket(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const ticket = await this.findTicketById(id);
      if (!ticket) {
        res.status(404).json(ServiceResponse.error('NOT_FOUND', 'Ticket not found'));
        return;
      }

      // Update ticket
      const updatedTicket = {
        ...ticket,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      // Recalculate SLA if priority changed
      if (updates.priority && updates.priority !== ticket.priority) {
        const slaTargetHours = getSLATargetHours(updatedTicket.priority, updatedTicket.type);
        updatedTicket.sla_deadline = new Date(Date.now() + slaTargetHours * 60 * 60 * 1000).toISOString();
      }

      // Check SLA breach
      updatedTicket.sla_breached = calculateSLABreach(updatedTicket.sla_deadline);

      const savedTicket = await this.saveTicket(updatedTicket);

      logger.info('Ticket updated', { ticketId: id });

      res.json(ServiceResponse.success(savedTicket));
    } catch (error) {
      logger.error('Update ticket error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Failed to update ticket'));
    }
  }

  /**
   * Delete ticket (soft delete)
   */
  async deleteTicket(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const ticket = await this.findTicketById(id);
      if (!ticket) {
        res.status(404).json(ServiceResponse.error('NOT_FOUND', 'Ticket not found'));
        return;
      }

      // Soft delete - mark as deleted
      await this.softDeleteTicket(id);

      logger.info('Ticket deleted', { ticketId: id });

      res.json(ServiceResponse.success({ message: 'Ticket deleted successfully' }));
    } catch (error) {
      logger.error('Delete ticket error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Failed to delete ticket'));
    }
  }

  /**
   * Escalate ticket to next level
   */
  async escalateTicket(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const ticket = await this.findTicketById(id);
      if (!ticket) {
        res.status(404).json(ServiceResponse.error('NOT_FOUND', 'Ticket not found'));
        return;
      }

      if (ticket.escalation_level >= 3) {
        res.status(400).json(ServiceResponse.error('VALIDATION_ERROR', 'Ticket is already at maximum escalation level'));
        return;
      }

      const escalatedTicket = {
        ...ticket,
        escalation_level: ticket.escalation_level + 1,
        updated_at: new Date().toISOString(),
      };

      // Extend SLA deadline on escalation
      const additionalHours = 24; // 24 hours additional per escalation
      if (escalatedTicket.sla_deadline) {
        const newDeadline = new Date(escalatedTicket.sla_deadline);
        newDeadline.setHours(newDeadline.getHours() + additionalHours);
        escalatedTicket.sla_deadline = newDeadline.toISOString();
      }

      const savedTicket = await this.saveTicket(escalatedTicket);

      logger.info('Ticket escalated', {
        ticketId: id,
        fromLevel: ticket.escalation_level,
        toLevel: escalatedTicket.escalation_level,
        reason,
      });

      res.json(ServiceResponse.success(savedTicket));
    } catch (error) {
      logger.error('Escalate ticket error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Failed to escalate ticket'));
    }
  }

  /**
   * Assign ticket to user
   */
  async assignTicket(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { user_id } = req.body;

      if (!user_id) {
        res.status(400).json(ServiceResponse.error('VALIDATION_ERROR', 'User ID is required'));
        return;
      }

      const ticket = await this.findTicketById(id);
      if (!ticket) {
        res.status(404).json(ServiceResponse.error('NOT_FOUND', 'Ticket not found'));
        return;
      }

      const assignedTicket = {
        ...ticket,
        assigned_to: user_id,
        status: ticket.status === 'open' ? 'in_progress' : ticket.status,
        updated_at: new Date().toISOString(),
      };

      const savedTicket = await this.saveTicket(assignedTicket);

      logger.info('Ticket assigned', { ticketId: id, assignedTo: user_id });

      res.json(ServiceResponse.success(savedTicket));
    } catch (error) {
      logger.error('Assign ticket error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Failed to assign ticket'));
    }
  }

  /**
   * Close ticket
   */
  async closeTicket(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { resolution } = req.body;

      const ticket = await this.findTicketById(id);
      if (!ticket) {
        res.status(404).json(ServiceResponse.error('NOT_FOUND', 'Ticket not found'));
        return;
      }

      const closedTicket = {
        ...ticket,
        status: 'closed' as TicketStatus,
        metadata: {
          ...ticket.metadata,
          resolution,
          closed_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      };

      const savedTicket = await this.saveTicket(closedTicket);

      logger.info('Ticket closed', { ticketId: id, resolution });

      res.json(ServiceResponse.success(savedTicket));
    } catch (error) {
      logger.error('Close ticket error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Failed to close ticket'));
    }
  }

  /**
   * Get SLA statistics
   */
  async getSLAStats(req: Request, res: Response): Promise<void> {
    try {
      const { tenant_id, days = 30 } = req.query;

      // Placeholder - would calculate real SLA stats
      const stats = {
        total_tickets: 150,
        sla_compliant: 120,
        sla_breached: 30,
        compliance_rate: 80,
        avg_resolution_time: '4.2 hours',
        period_days: days,
      };

      res.json(ServiceResponse.success(stats));
    } catch (error) {
      logger.error('Get SLA stats error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Failed to retrieve SLA statistics'));
    }
  }

  // ==================== PRIVATE HELPER METHODS - KISS ====================

  private async findTickets(filters: any, pagination: { page: number; limit: number }): Promise<Ticket[]> {
    // Placeholder - would use Prisma to find tickets with filters and pagination
    return [];
  }

  private async countTickets(filters: any): Promise<number> {
    // Placeholder - would count tickets with filters
    return 0;
  }

  private async findTicketById(id: string): Promise<Ticket | null> {
    // Placeholder - would use Prisma to find ticket
    return null;
  }

  private async saveTicket(ticket: Ticket): Promise<Ticket> {
    // Placeholder - would use Prisma to save ticket
    return ticket;
  }

  private async softDeleteTicket(id: string): Promise<void> {
    // Placeholder - would mark ticket as deleted
  }
}
