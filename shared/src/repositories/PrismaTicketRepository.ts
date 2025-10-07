/**
 * @fileoverview Prisma Ticket Repository
 * @principle DRY - Concrete implementation for Tickets with SLA tracking
 */

import { getPrismaClient } from '../services/prisma.service';
import { Repository } from '../services/BaseService';

/**
 * Prisma Ticket Repository
 * Implements Repository interface for Tickets using Prisma Client
 */
export class PrismaTicketRepository implements Repository<any> {
  private prisma = getPrismaClient();

  async find(filter: any): Promise<any[]> {
    const { tenant_id, skip, limit, ...where } = filter;
    
    return this.prisma.ticket.findMany({
      where: {
        tenantId: tenant_id,
        ...where,
      },
      skip,
      take: limit,
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
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(filter: any): Promise<any | null> {
    return this.prisma.ticket.findFirst({
      where: filter,
      include: {
        tenant: true,
        creator: true,
        assignee: true,
        site: true,
        messages: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  }

  async create(data: any): Promise<any> {
    const { tenant_id, created_by, assigned_to, wordpress_site_id, ...createData } = data;
    
    return this.prisma.ticket.create({
      data: {
        tenantId: tenant_id,
        createdBy: created_by,
        assignedTo: assigned_to,
        wordPressSiteId: wordpress_site_id,
        subject: createData.subject,
        description: createData.description,
        priority: createData.priority || 'medium',
        status: createData.status || 'open',
        category: createData.category,
        slaResponseDeadline: createData.sla_response_deadline,
        slaResolutionDeadline: createData.sla_resolution_deadline,
      },
      include: {
        tenant: true,
        creator: true,
        assignee: true,
        site: true,
        messages: true,
      },
    });
  }

  async update(id: string, data: any): Promise<any> {
    const updateData: any = {};
    
    if (data.subject) updateData.subject = data.subject;
    if (data.description) updateData.description = data.description;
    if (data.status) updateData.status = data.status;
    if (data.priority) updateData.priority = data.priority;
    if (data.category) updateData.category = data.category;
    if (data.assigned_to) updateData.assignedTo = data.assigned_to;
    if (data.sla_response_deadline) updateData.slaResponseDeadline = new Date(data.sla_response_deadline);
    if (data.sla_resolution_deadline) updateData.slaResolutionDeadline = new Date(data.sla_resolution_deadline);
    if (data.resolved_at) updateData.resolvedAt = new Date(data.resolved_at);
    if (data.closed_at) updateData.closedAt = new Date(data.closed_at);
    if (data.updated_at) updateData.updatedAt = new Date(data.updated_at);

    return this.prisma.ticket.update({
      where: { id },
      data: updateData,
      include: {
        tenant: true,
        creator: true,
        assignee: true,
        site: true,
        messages: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.ticket.delete({
      where: { id },
    });
  }

  async count(filter: any): Promise<number> {
    const { tenant_id, skip, limit, ...where } = filter;
    
    return this.prisma.ticket.count({
      where: {
        tenantId: tenant_id,
        ...where,
      },
    });
  }
}
