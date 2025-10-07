/**
 * @fileoverview DTO (Data Transfer Objects) Types
 * @principle DRY - Reusable DTOs for create/update operations
 */

import {
  TenantTier,
  UserRole,
  TicketPriority,
  TicketCategory,
  WhiteLabelConfig,
} from './core';

// ==================== TENANT DTOs ====================

export interface CreateTenantDto {
  name: string;
  domain: string;
  parent_tenant_id?: string;
  tier: TenantTier;
}

export interface UpdateTenantDto {
  name?: string;
  tier?: TenantTier;
  white_label_config?: Partial<WhiteLabelConfig>;
}

// ==================== USER DTOs ====================

export interface CreateUserDto {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone?: string;
}

export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto extends CreateUserDto {
  tenant_name: string;
  tenant_domain: string;
}

// ==================== WORDPRESS SITE DTOs ====================

export interface DeployWordPressSiteDto {
  name: string;
  domain: string;
  wordpress_version?: string;
  php_version?: string;
  admin_email: string;
  admin_username: string;
  admin_password: string;
}

export interface UpdateWordPressSiteDto {
  name?: string;
  domain?: string;
}

// ==================== TICKET DTOs ====================

export interface CreateTicketDto {
  subject: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
  wordpress_site_id?: string;
}

export interface UpdateTicketDto {
  subject?: string;
  description?: string;
  priority?: TicketPriority;
  status?: string;
  assigned_to?: string;
}

export interface CreateTicketMessageDto {
  ticket_id: string;
  message: string;
  attachments?: string[];
  is_internal?: boolean;
}

// ==================== DOMAIN DTOs ====================

export interface RegisterDomainDto {
  name: string;
  wordpress_site_id?: string;
  auto_renew?: boolean;
}

export interface UpdateDomainDto {
  auto_renew?: boolean;
  nameservers?: string[];
}

// ==================== NOTIFICATION DTOs ====================

export interface SendNotificationDto {
  user_id?: string;
  type: string;
  title: string;
  message: string;
  channels: string[];
  metadata?: Record<string, any>;
}
