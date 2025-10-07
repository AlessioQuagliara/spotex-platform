/**
 * @fileoverview Ticket Service - Ticket management with SLA
 * @principle DRY - Extends BaseService
 * @principle KISS - Simple SLA calculation and escalation
 */

import { BaseService, Repository } from './BaseService';
import {
  Ticket,
  TicketPriority,
  TicketStatus,
  CreateTicketDto,
  UpdateTicketDto,
  TenantTier,
} from '../types';

interface SLADates {
  responseDeadline: string;
  resolutionDeadline: string;
}

/**
 * Ticket Service - Specialized ticket management
 */
export class TicketService extends BaseService<Ticket> {
  protected repository!: Repository<Ticket>;

  /**
   * Create ticket with automatic SLA calculation
   */
  async createTicket(tenantId: string, data: CreateTicketDto, userId: string): Promise<Ticket> {
    // Calculate SLA deadlines
    const sla = await this.calculateSLA(tenantId, data.priority);

    const ticket = await this.create(tenantId, {
      ...data,
      status: 'open',
      created_by: userId,
      sla_response_deadline: sla.responseDeadline,
      sla_resolution_deadline: sla.resolutionDeadline,
    } as any);

    return ticket;
  }

  /**
   * Update ticket status
   */
  async updateStatus(
    tenantId: string,
    ticketId: string,
    status: TicketStatus,
    userId: string
  ): Promise<Ticket> {
    const ticket = await this.findOneOrFail(tenantId, ticketId);

    const updates: Partial<Ticket> = { status };

    // Set timestamps based on status
    if (status === 'resolved') {
      updates.resolved_at = new Date().toISOString();
    } else if (status === 'closed') {
      updates.closed_at = new Date().toISOString();
    }

    return this.update(tenantId, ticketId, updates);
  }

  /**
   * Assign ticket to user
   */
  async assignTicket(tenantId: string, ticketId: string, assigneeId: string): Promise<Ticket> {
    return this.update(tenantId, ticketId, {
      assigned_to: assigneeId,
      status: 'in_progress',
    } as any);
  }

  /**
   * Escalate ticket priority
   */
  async escalateTicket(tenantId: string, ticketId: string): Promise<Ticket> {
    const ticket = await this.findOneOrFail(tenantId, ticketId);

    const newPriority = this.getNextPriorityLevel(ticket.priority);

    if (newPriority === ticket.priority) {
      throw new Error('Ticket is already at highest priority');
    }

    // Recalculate SLA for new priority
    const sla = await this.calculateSLA(tenantId, newPriority);

    return this.update(tenantId, ticketId, {
      priority: newPriority,
      sla_response_deadline: sla.responseDeadline,
      sla_resolution_deadline: sla.resolutionDeadline,
    } as any);
  }

  /**
   * Get tickets near SLA breach
   */
  async getTicketsNearSLABreach(tenantId: string): Promise<Ticket[]> {
    const tickets = await this.findAll(tenantId, {
      status: 'open',
    } as any);

    const now = new Date();
    const warningThreshold = 2 * 60 * 60 * 1000; // 2 hours

    return tickets.filter(ticket => {
      if (!ticket.sla_response_deadline) return false;
      const deadline = new Date(ticket.sla_response_deadline);
      const timeUntilBreach = deadline.getTime() - now.getTime();
      return timeUntilBreach > 0 && timeUntilBreach < warningThreshold;
    });
  }

  /**
   * Get overdue tickets
   */
  async getOverdueTickets(tenantId: string): Promise<Ticket[]> {
    const tickets = await this.findAll(tenantId, {
      status: 'open',
    } as any);

    const now = new Date();

    return tickets.filter(ticket => {
      if (!ticket.sla_response_deadline) return false;
      const deadline = new Date(ticket.sla_response_deadline);
      return deadline.getTime() < now.getTime();
    });
  }

  // ==================== PRIVATE HELPER METHODS - KISS ====================

  /**
   * Calculate SLA deadlines based on tenant tier and priority
   */
  private async calculateSLA(tenantId: string, priority: TicketPriority): Promise<SLADates> {
    // Get tenant tier (would use TenantService in real implementation)
    const tier: TenantTier = 'business'; // Placeholder

    const baseSLA = this.getBaseSLAByTier(tier);
    const multiplier = this.getPriorityMultiplier(priority);

    const now = new Date();

    const responseHours = baseSLA.responseHours * multiplier;
    const resolutionHours = baseSLA.resolutionHours * multiplier;

    const responseDeadline = new Date(now.getTime() + responseHours * 60 * 60 * 1000);
    const resolutionDeadline = new Date(now.getTime() + resolutionHours * 60 * 60 * 1000);

    return {
      responseDeadline: responseDeadline.toISOString(),
      resolutionDeadline: resolutionDeadline.toISOString(),
    };
  }

  private getBaseSLAByTier(tier: TenantTier): {
    responseHours: number;
    resolutionHours: number;
  } {
    const slaByTier = {
      starter: { responseHours: 24, resolutionHours: 72 },
      business: { responseHours: 8, resolutionHours: 24 },
      enterprise: { responseHours: 2, resolutionHours: 8 },
    };

    return slaByTier[tier];
  }

  private getPriorityMultiplier(priority: TicketPriority): number {
    const multipliers: Record<TicketPriority, number> = {
      low: 2.0,
      medium: 1.0,
      high: 0.5,
      critical: 0.25,
    };

    return multipliers[priority];
  }

  private getNextPriorityLevel(current: TicketPriority): TicketPriority {
    const escalationPath: Record<TicketPriority, TicketPriority> = {
      low: 'medium',
      medium: 'high',
      high: 'critical',
      critical: 'critical',
    };

    return escalationPath[current];
  }
}
