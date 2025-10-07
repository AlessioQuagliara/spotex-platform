/**
 * @fileoverview Auth Types - Authentication & Authorization
 * @principle DRY - Unified auth structures across all services
 */

import { UserRole } from './core';

// ==================== JWT PAYLOAD ====================

export interface JwtPayload {
  userId: string;
  tenantId: string;
  email: string;
  role: UserRole;
  permissions: string[];
  iat?: number;
  exp?: number;
}

// ==================== AUTH RESPONSE ====================

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: UserRole;
    tenant_id: string;
    avatar?: string;
  };
  token: string;
  expiresAt: string;
}

// ==================== REFRESH TOKEN ====================

export interface RefreshTokenDto {
  refreshToken: string;
}

// ==================== PASSWORD RESET ====================

export interface RequestPasswordResetDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

// ==================== PERMISSIONS ====================

export type Permission =
  // Tenant management
  | 'tenant:read'
  | 'tenant:write'
  | 'tenant:delete'
  // User management
  | 'user:read'
  | 'user:write'
  | 'user:delete'
  | 'user:invite'
  // Site management
  | 'site:read'
  | 'site:write'
  | 'site:delete'
  | 'site:deploy'
  // Ticket management
  | 'ticket:read'
  | 'ticket:write'
  | 'ticket:assign'
  | 'ticket:close'
  // Domain management
  | 'domain:read'
  | 'domain:write'
  | 'domain:register'
  // Billing
  | 'billing:read'
  | 'billing:write';

/**
 * Role-based permission mappings
 * Defined once, used everywhere
 */
export const RolePermissions: Record<UserRole, Permission[]> = {
  super_admin: [
    'tenant:read',
    'tenant:write',
    'tenant:delete',
    'user:read',
    'user:write',
    'user:delete',
    'user:invite',
    'site:read',
    'site:write',
    'site:delete',
    'site:deploy',
    'ticket:read',
    'ticket:write',
    'ticket:assign',
    'ticket:close',
    'domain:read',
    'domain:write',
    'domain:register',
    'billing:read',
    'billing:write',
  ],
  agency_admin: [
    'tenant:read',
    'user:read',
    'user:write',
    'user:invite',
    'site:read',
    'site:write',
    'site:deploy',
    'ticket:read',
    'ticket:write',
    'domain:read',
    'domain:write',
    'domain:register',
    'billing:read',
  ],
  agency_user: [
    'user:read',
    'site:read',
    'site:write',
    'ticket:read',
    'ticket:write',
    'domain:read',
  ],
  client_admin: [
    'tenant:read',
    'user:read',
    'user:write',
    'site:read',
    'ticket:read',
    'ticket:write',
    'domain:read',
  ],
  client_user: ['site:read', 'ticket:read', 'ticket:write'],
};
