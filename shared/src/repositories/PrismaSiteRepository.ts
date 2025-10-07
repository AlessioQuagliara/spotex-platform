/**
 * @fileoverview Prisma Site Repository
 * @principle DRY - Concrete implementation for WordPress Sites
 */

import { getPrismaClient } from '../services/prisma.service';
import { Repository } from '../services/BaseService';

/**
 * Prisma Site Repository
 * Implements Repository interface for WordPress Sites using Prisma Client
 */
export class PrismaSiteRepository implements Repository<any> {
  private prisma = getPrismaClient();

  async find(filter: any): Promise<any[]> {
    const { tenant_id, skip, limit, ...where } = filter;
    
    return this.prisma.wordPressSite.findMany({
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
            domain: true,
          },
        },
        domains: {
          select: {
            id: true,
            name: true,
            status: true,
            sslStatus: true,
            expiresAt: true,
          },
        },
        tickets: {
          where: {
            status: {
              in: ['open', 'in_progress'],
            },
          },
          select: {
            id: true,
            subject: true,
            priority: true,
            status: true,
          },
        },
      },
    });
  }

  async findOne(filter: any): Promise<any | null> {
    return this.prisma.wordPressSite.findFirst({
      where: filter,
      include: {
        tenant: true,
        domains: true,
        tickets: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });
  }

  async create(data: any): Promise<any> {
    const { tenant_id, ...createData } = data;
    
    return this.prisma.wordPressSite.create({
      data: {
        tenantId: tenant_id,
        name: createData.name,
        domain: createData.domain,
        status: createData.status || 'deploying',
        wordpressVersion: createData.wordpress_version || 'latest',
        phpVersion: createData.php_version || '8.1',
        serverDetails: createData.server_details || {},
        adminUrl: createData.admin_url || null,
        adminUsername: createData.admin_username || null,
        adminEmail: createData.admin_email || null,
        deployedAt: createData.deployed_at || null,
        lastBackupAt: createData.last_backup_at || null,
      },
      include: {
        tenant: true,
        domains: true,
      },
    });
  }

  async update(id: string, data: any): Promise<any> {
    const updateData: any = {};
    
    if (data.name) updateData.name = data.name;
    if (data.domain) updateData.domain = data.domain;
    if (data.status) updateData.status = data.status;
    if (data.wordpress_version) updateData.wordpressVersion = data.wordpress_version;
    if (data.php_version) updateData.phpVersion = data.php_version;
    if (data.server_details) updateData.serverDetails = data.server_details;
    if (data.admin_url) updateData.adminUrl = data.admin_url;
    if (data.admin_username) updateData.adminUsername = data.admin_username;
    if (data.deployed_at) updateData.deployedAt = new Date(data.deployed_at);
    if (data.last_backup_at) updateData.lastBackupAt = new Date(data.last_backup_at);
    if (data.updated_at) updateData.updatedAt = new Date(data.updated_at);

    return this.prisma.wordPressSite.update({
      where: { id },
      data: updateData,
      include: {
        tenant: true,
        domains: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.wordPressSite.delete({
      where: { id },
    });
  }

  async count(filter: any): Promise<number> {
    const { tenant_id, skip, limit, ...where } = filter;
    
    return this.prisma.wordPressSite.count({
      where: {
        tenantId: tenant_id,
        ...where,
      },
    });
  }
}
