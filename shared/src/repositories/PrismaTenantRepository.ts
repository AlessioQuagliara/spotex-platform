/**
 * @fileoverview Prisma Tenant Repository
 * @principle DRY - Concrete implementation of Repository interface with Prisma
 */

import { getPrismaClient } from '../services/prisma.service';
import { Repository } from '../services/BaseService';

/**
 * Prisma Tenant Repository
 * Implements Repository interface using Prisma Client
 */
export class PrismaTenantRepository implements Repository<any> {
  private prisma = getPrismaClient();

  async find(filter: any): Promise<any[]> {
    const { tenant_id, skip, limit, ...where } = filter;
    
    return this.prisma.tenant.findMany({
      where: {
        ...(tenant_id ? { id: tenant_id } : {}),
        ...where,
      },
      skip,
      take: limit,
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            status: true,
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
  }

  async findOne(filter: any): Promise<any | null> {
    return this.prisma.tenant.findFirst({
      where: filter,
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            status: true,
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
  }

  async create(data: any): Promise<any> {
    const { tenant_id, ...createData } = data;
    
    return this.prisma.tenant.create({
      data: {
        name: createData.name,
        domain: createData.domain,
        parentTenantId: createData.parent_tenant_id,
        tier: createData.tier || 'starter',
        status: createData.status || 'trial',
        whiteLabelConfig: createData.white_label_config || {},
        limits: createData.limits || {},
        trialEndsAt: createData.trial_ends_at,
      },
      include: {
        users: true,
        sites: true,
        _count: {
          select: {
            users: true,
            sites: true,
            tickets: true,
          },
        },
      },
    });
  }

  async update(id: string, data: any): Promise<any> {
    const updateData: any = {};
    
    if (data.name) updateData.name = data.name;
    if (data.domain) updateData.domain = data.domain;
    if (data.tier) updateData.tier = data.tier;
    if (data.status) updateData.status = data.status;
    if (data.white_label_config) updateData.whiteLabelConfig = data.white_label_config;
    if (data.limits) updateData.limits = data.limits;
    if (data.trial_ends_at) updateData.trialEndsAt = data.trial_ends_at;
    if (data.updated_at) updateData.updatedAt = new Date(data.updated_at);

    return this.prisma.tenant.update({
      where: { id },
      data: updateData,
      include: {
        users: true,
        sites: true,
        _count: {
          select: {
            users: true,
            sites: true,
            tickets: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tenant.delete({
      where: { id },
    });
  }

  async count(filter: any): Promise<number> {
    const { tenant_id, skip, limit, ...where } = filter;
    
    return this.prisma.tenant.count({
      where: {
        ...(tenant_id ? { id: tenant_id } : {}),
        ...where,
      },
    });
  }
}
