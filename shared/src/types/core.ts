/**
 * @fileoverview Core Types - Base entities for entire platform
 * @principle DRY - All base types defined once, used everywhere
 */

// ==================== BASE ENTITY ====================

/**
 * Base entity with common fields for all database models
 * Every entity in the system extends this interface
 */
export interface BaseEntity {
  id: string;
  tenant_id: string;
  created_at: string;
  updated_at?: string;
}

// ==================== TENANT TYPES ====================

export type TenantTier = 'starter' | 'business' | 'enterprise';

export type TenantStatus = 'active' | 'suspended' | 'trial' | 'cancelled';

export interface WhiteLabelConfig {
  logo?: string;
  favicon?: string;
  colors: {
    primary: string;
    secondary?: string;
    accent?: string;
  };
  customDomains: string[];
  emailFrom?: string;
  supportEmail?: string;
  companyName?: string;
}

export interface TenantLimits {
  maxSites: number;
  maxUsers: number;
  maxStorage: number; // in GB
  maxBandwidth: number; // in GB per month
  maxTicketsPerMonth: number;
}

export interface Tenant extends BaseEntity {
  name: string;
  domain: string; // subdomain.spotexsrl.com
  parent_tenant_id?: string; // For agency -> client hierarchy
  tier: TenantTier;
  status: TenantStatus;
  white_label_config: WhiteLabelConfig;
  limits: TenantLimits;
  trial_ends_at?: string;
}

// ==================== USER TYPES ====================

export type UserRole = 
  | 'super_admin'      // Spotex administrators
  | 'agency_admin'     // Agency owner
  | 'agency_user'      // Agency employee
  | 'client_admin'     // Client owner
  | 'client_user';     // Client employee

export type UserStatus = 'active' | 'inactive' | 'invited';

export interface User extends BaseEntity {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  status: UserStatus;
  permissions: string[];
  avatar?: string;
  phone?: string;
  last_login_at?: string;
  invited_by?: string;
}

// ==================== WORDPRESS SITE TYPES ====================

export type SiteStatus = 
  | 'deploying' 
  | 'active' 
  | 'suspended' 
  | 'error' 
  | 'deleting';

export interface WordPressSite extends BaseEntity {
  name: string;
  domain: string;
  status: SiteStatus;
  wordpress_version: string;
  php_version: string;
  server_details: {
    server_id?: string;
    ip_address?: string;
    ssh_user?: string;
    ssh_port?: number;
    database_name?: string;
    database_user?: string;
  };
  admin_url: string;
  admin_username: string;
  deployed_at?: string;
  last_backup_at?: string;
}

// ==================== TICKET TYPES ====================

export type TicketStatus = 
  | 'open' 
  | 'in_progress' 
  | 'waiting_customer' 
  | 'resolved' 
  | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export type TicketCategory = 
  | 'technical' 
  | 'billing' 
  | 'feature_request' 
  | 'bug_report' 
  | 'general';

export type TicketType = 'support' | 'incident' | 'change' | 'problem';

export interface Ticket extends BaseEntity {
  title: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  type: TicketType;
  created_by: string; // User ID
  assigned_to?: string; // User ID
  wordpress_site_id?: string;
  escalation_level: number;
  sla_deadline?: string;
  sla_response_deadline?: string;
  sla_resolution_deadline?: string;
  sla_breached?: boolean;
  tags?: string[];
  resolved_at?: string;
  closed_at?: string;
  metadata?: Record<string, any>;
}

export interface TicketMessage extends BaseEntity {
  ticket_id: string;
  user_id: string;
  message: string;
  attachments?: string[];
  is_internal: boolean; // Internal notes not visible to client
}

// ==================== DOMAIN TYPES ====================

export type DomainStatus = 
  | 'pending_verification' 
  | 'active' 
  | 'expired' 
  | 'transferring' 
  | 'error';

export type SSLStatus = 
  | 'none'
  | 'pending' 
  | 'active' 
  | 'expired' 
  | 'error';

export interface Domain extends BaseEntity {
  tenant_id: string;
  name: string; // example.com
  type: 'custom' | 'subdomain';
  status: DomainStatus;
  ssl_status: SSLStatus;
  verification_token?: string;
  verified_at?: string;
  ssl_certificate?: SSLCertificate;
  ssl_expires_at?: string;
  wordpress_site_id?: string;
  registrar?: string;
  registered_at?: string;
  expires_at?: string;
  auto_renew: boolean;
  nameservers: string[];
  dns_records: DNSRecord[];
}

export interface SSLCertificate {
  issuer: string;
  valid_from: string;
  valid_to: string;
  certificate: string;
  private_key: string;
}

export interface DNSRecord {
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS';
  name: string;
  value: string;
  ttl: number;
  priority?: number; // For MX records
}

// ==================== NOTIFICATION TYPES ====================

export type NotificationType = 'email' | 'sms' | 'webhook' | 'in_app';

export type NotificationEventType =
  | 'ticket_created'
  | 'ticket_updated'
  | 'site_deployed'
  | 'site_error'
  | 'domain_expiring'
  | 'payment_required'
  | 'system_alert';

export type NotificationChannel = 'email' | 'sms' | 'in_app' | 'webhook';

// ==================== AUDIT LOG TYPES ====================

export type AuditAction = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'login' 
  | 'logout' 
  | 'deploy' 
  | 'suspend';

export interface AuditLog extends BaseEntity {
  user_id: string;
  action: AuditAction;
  entity_type: string; // 'User', 'Site', 'Domain', etc.
  entity_id: string;
  changes?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

// ==================== PAYMENT TYPES ====================

export type PaymentStatus = 
  | 'pending' 
  | 'completed' 
  | 'failed' 
  | 'refunded';

export interface Payment extends BaseEntity {
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method?: string;
  transaction_id?: string;
  invoice_url?: string;
  paid_at?: string;
  refunded_at?: string;
}

export interface Subscription extends BaseEntity {
  tier: TenantTier;
  status: 'active' | 'cancelled' | 'past_due';
  current_period_start: string;
  current_period_end: string;
  cancel_at?: string;
  stripe_subscription_id?: string;
}

// ==================== NOTIFICATION TYPES ====================

export type NotificationStatus = 'queued' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Notification extends BaseEntity {
  tenant_id: string;
  user_id?: string;
  type: NotificationType;
  recipient: string;
  subject?: string;
  message: string;
  status: NotificationStatus;
  priority: 'low' | 'normal' | 'high';
  data?: Record<string, any>;
  sent_at?: string;
  read_at?: string;
  error_message?: string;
}

export interface NotificationTemplate extends BaseEntity {
  tenant_id: string;
  name: string;
  type: NotificationType;
  subject?: string;
  content: string;
  variables: string[];
}


// ==================== DEPLOYMENT TYPES ====================

export type DeploymentStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface Deployment extends BaseEntity {
  tenant_id: string;
  domain_id: string;
  status: DeploymentStatus;
  wordpress_version: string;
  php_version: string;
  theme?: string;
  plugins: string[];
  admin_user: string;
  admin_email: string;
  server_config: Record<string, any>;
  logs: DeploymentLog[];
  completed_at?: string;
  error_message?: string;
}

export interface DeploymentLog {
  timestamp: string;
  message: string;
  level?: 'info' | 'warn' | 'error';
}

export interface Backup extends BaseEntity {
  site_id: string;
  type: 'full' | 'database' | 'files';
  size_bytes?: number;
  download_url?: string;
  expires_at?: string;
}

