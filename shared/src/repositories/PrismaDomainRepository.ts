/**
 * @fileoverview Prisma Domain Repository
 * @principle DRY - Concrete implementation for Domains with SSL tracking
 */

import { getPrismaClient } from '../services/prisma.service';
import { Repository } from '../services/BaseService';

/**
 * Prisma Domain Repository
 * Implements Repository interface for Domains using Prisma Client
 */
export class PrismaDomainRepository implements Repository<any> {
  private prisma = getPrismaClient();

  async find(filter: any): Promise<any[]> {
    const { tenant_id, skip, limit, ...where } = filter;
    
    return this.prisma.domain.findMany({
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
        site: {
          select: {
            id: true,
            name: true,
            domain: true,
            status: true,
          },
        },
      },
      orderBy: {
        expiresAt: 'asc',
      },
    });
  }

  async findOne(filter: any): Promise<any | null> {
    return this.prisma.domain.findFirst({
      where: filter,
      include: {
        tenant: true,
        site: true,
      },
    });
  }

  async create(data: any): Promise<any> {
    const { tenant_id, wordpress_site_id, ...createData } = data;
    
    return this.prisma.domain.create({
      data: {
        tenantId: tenant_id,
        wordPressSiteId: wordpress_site_id,
        name: createData.name,
        status: createData.status || 'pending',
        sslStatus: createData.ssl_status || 'pending',
        registrar: createData.registrar,
        registeredAt: createData.registered_at,
        expiresAt: createData.expires_at,
        autoRenew: createData.auto_renew !== false,
        nameservers: createData.nameservers || [],
        dnsRecords: createData.dns_records || [],
      },
      include: {
        tenant: true,
        site: true,
      },
    });
  }

  async update(id: string, data: any): Promise<any> {
    const updateData: any = {};
    
    if (data.name) updateData.name = data.name;
    if (data.status) updateData.status = data.status;
    if (data.ssl_status) updateData.sslStatus = data.ssl_status;
    if (data.registrar) updateData.registrar = data.registrar;
    if (data.registered_at) updateData.registeredAt = new Date(data.registered_at);
    if (data.expires_at) updateData.expiresAt = new Date(data.expires_at);
    if (data.auto_renew !== undefined) updateData.autoRenew = data.auto_renew;
    if (data.nameservers) updateData.nameservers = data.nameservers;
    if (data.dns_records) updateData.dnsRecords = data.dns_records;
    if (data.updated_at) updateData.updatedAt = new Date(data.updated_at);

    return this.prisma.domain.update({
      where: { id },
      data: updateData,
      include: {
        tenant: true,
        site: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.domain.delete({
      where: { id },
    });
  }

  async count(filter: any): Promise<number> {
    const { tenant_id, skip, limit, ...where } = filter;
    
    return this.prisma.domain.count({
      where: {
        tenantId: tenant_id,
        ...where,
      },
    });
  }
}
