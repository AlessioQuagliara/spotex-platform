/**
 * @fileoverview SLA Monitor Service - Automatic ticket escalation and SLA breach monitoring
 * @principle KISS - Simple SLA monitoring with clear escalation rules
 */

import { PrismaTicketRepository } from '@spotex/shared';
import { createLogger } from '@spotex/shared';

const logger = createLogger('sla-monitor');

export interface SLABreachInfo {
  ticketId: string;
  tenantId: string;
  priority: string;
  slaDeadline: string;
  timeOverdue: number; // minutes
  assignedTo?: string;
}

export class SLAMonitor {
  private ticketRepo: PrismaTicketRepository;

  constructor() {
    this.ticketRepo = new PrismaTicketRepository();
  }

  /**
   * Check for overdue tickets and escalate them
   */
  async checkOverdueTickets(): Promise<void> {
    try {
      logger.info('Checking for overdue tickets');

      const overdueTickets = await this.findOverdueTickets();

      if (overdueTickets.length === 0) {
        logger.info('No overdue tickets found');
        return;
      }

      logger.warn(`Found ${overdueTickets.length} overdue tickets`);

      for (const ticket of overdueTickets) {
        await this.escalateTicket(ticket);
        await this.notifyStakeholders(ticket);
      }

    } catch (error) {
      logger.error('Error checking overdue tickets', { error: (error as Error).message });
    }
  }

  /**
   * Find all tickets that have breached their SLA
   */
  private async findOverdueTickets(): Promise<any[]> {
    const now = new Date();

    // Get all open tickets
    const openTickets = await this.ticketRepo.find({
      status: { $in: ['open', 'in_progress'] }
    });

    const overdueTickets: any[] = [];

    for (const ticket of openTickets) {
      if (!ticket.slaDeadline) continue;

      const deadline = new Date(ticket.slaDeadline);
      if (now > deadline) {
        const timeOverdue = Math.floor((now.getTime() - deadline.getTime()) / (1000 * 60)); // minutes

        overdueTickets.push({
          ...ticket,
          timeOverdue,
        });
      }
    }

    return overdueTickets;
  }

  /**
   * Escalate a ticket based on its priority and overdue time
   */
  private async escalateTicket(ticket: any): Promise<void> {
    try {
      const newPriority = this.calculateEscalatedPriority(ticket.priority, ticket.timeOverdue);

      if (newPriority !== ticket.priority) {
        await this.ticketRepo.update(ticket.id, {
          priority: newPriority,
          escalatedAt: new Date(),
          escalationReason: `SLA breach - was ${ticket.priority}, escalated to ${newPriority}`,
        });

        logger.info(`Ticket ${ticket.id} escalated from ${ticket.priority} to ${newPriority}`);
      }

      // Auto-assign to next available agent if not assigned
      if (!ticket.assignedTo) {
        await this.autoAssignTicket(ticket.id, newPriority);
      }

    } catch (error) {
      logger.error(`Error escalating ticket ${ticket.id}`, { error: (error as Error).message });
    }
  }

  /**
   * Calculate escalated priority based on current priority and overdue time
   */
  private calculateEscalatedPriority(currentPriority: string, timeOverdue: number): string {
    // Escalation rules:
    // - Low priority: escalate to medium after 2 hours
    // - Medium priority: escalate to high after 1 hour
    // - High priority: escalate to critical after 30 minutes
    // - Critical: remains critical

    switch (currentPriority) {
      case 'low':
        return timeOverdue > 120 ? 'medium' : currentPriority; // 2 hours
      case 'medium':
        return timeOverdue > 60 ? 'high' : currentPriority; // 1 hour
      case 'high':
        return timeOverdue > 30 ? 'critical' : currentPriority; // 30 minutes
      case 'critical':
      default:
        return currentPriority;
    }
  }

  /**
   * Auto-assign ticket to next available agent
   */
  private async autoAssignTicket(ticketId: string, priority: string): Promise<void> {
    try {
      // TODO: Implement agent availability logic
      // For now, assign to a default agent based on priority

      const agentAssignments = {
        critical: 'agent-critical@spotexsrl.com',
        high: 'agent-senior@spotexsrl.com',
        medium: 'agent-junior@spotexsrl.com',
        low: 'agent-intern@spotexsrl.com',
      };

      const assignedTo = agentAssignments[priority as keyof typeof agentAssignments] || 'agent-general@spotexsrl.com';

      await this.ticketRepo.update(ticketId, {
        assignedTo,
        assignedAt: new Date(),
      });

      logger.info(`Auto-assigned ticket ${ticketId} to ${assignedTo}`);

    } catch (error) {
      logger.error(`Error auto-assigning ticket ${ticketId}`, { error: (error as Error).message });
    }
  }

  /**
   * Notify stakeholders about SLA breach
   */
  private async notifyStakeholders(ticket: any): Promise<void> {
    try {
      const notifications = [
        {
          type: 'sla_breach',
          ticketId: ticket.id,
          priority: ticket.priority,
          timeOverdue: ticket.timeOverdue,
          recipients: [ticket.assignedTo, 'admin@spotexsrl.com'].filter(Boolean),
        }
      ];

      // TODO: Send notifications via notification service
      logger.info('SLA breach notifications queued', {
        ticketId: ticket.id,
        recipients: notifications[0].recipients,
      });

      // For now, just log - integrate with notification service later
      for (const notification of notifications) {
        await this.sendNotification(notification);
      }

    } catch (error) {
      logger.error(`Error notifying stakeholders for ticket ${ticket.id}`, { error: (error as Error).message });
    }
  }

  /**
   * Send notification (placeholder for notification service integration)
   */
  private async sendNotification(notification: any): Promise<void> {
    // TODO: Integrate with notification-service microservice
    logger.info('Sending notification', notification);

    // Example implementation:
    // await fetch('http://notification-service:3005/api/notifications', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     type: notification.type,
    //     recipients: notification.recipients,
    //     subject: `SLA Breach: Ticket ${notification.ticketId}`,
    //     message: `Ticket ${notification.ticketId} has breached SLA by ${notification.timeOverdue} minutes`,
    //     data: notification,
    //   }),
    // });
  }

  /**
   * Get SLA statistics for reporting
   */
  async getSLAStatistics(tenantId?: string): Promise<any> {
    try {
      const filter = tenantId ? { tenantId } : {};

      const tickets = await this.ticketRepo.find(filter);
      const now = new Date();

      let totalTickets = 0;
      let onTimeTickets = 0;
      let overdueTickets = 0;
      let avgResponseTime = 0;
      let avgResolutionTime = 0;

      for (const ticket of tickets) {
        totalTickets++;

        if (ticket.slaDeadline) {
          const deadline = new Date(ticket.slaDeadline);
          if (now > deadline) {
            overdueTickets++;
          } else {
            onTimeTickets++;
          }
        }

        // Calculate response time if assigned
        if (ticket.assignedAt && ticket.createdAt) {
          const responseTime = new Date(ticket.assignedAt).getTime() - new Date(ticket.createdAt).getTime();
          avgResponseTime += responseTime;
        }

        // Calculate resolution time if resolved
        if (ticket.resolvedAt && ticket.createdAt) {
          const resolutionTime = new Date(ticket.resolvedAt).getTime() - new Date(ticket.createdAt).getTime();
          avgResolutionTime += resolutionTime;
        }
      }

      if (totalTickets > 0) {
        avgResponseTime /= totalTickets;
        avgResolutionTime /= totalTickets;
      }

      return {
        totalTickets,
        onTimeTickets,
        overdueTickets,
        slaComplianceRate: totalTickets > 0 ? (onTimeTickets / totalTickets) * 100 : 0,
        avgResponseTime: Math.floor(avgResponseTime / (1000 * 60)), // minutes
        avgResolutionTime: Math.floor(avgResolutionTime / (1000 * 60)), // minutes
      };

    } catch (error) {
      logger.error('Error getting SLA statistics', { error: (error as Error).message });
      throw error;
    }
  }
}

// Export singleton instance
export const slaMonitor = new SLAMonitor();