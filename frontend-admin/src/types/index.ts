/**
 * @fileoverview TypeScript types for Spotex Admin Frontend
 * @principle DRY - Centralized type definitions
 */

export interface Agency {
  id: string;
  name: string;
  domain: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: 'starter' | 'professional' | 'enterprise';
  created_at: string;
  updated_at: string;
  total_sites: number;
  total_revenue: number;
  monthly_revenue: number;
}

export interface SystemMetrics {
  total_agencies: number;
  active_agencies: number;
  total_sites: number;
  total_deployments: number;
  system_health: 'healthy' | 'warning' | 'critical';
  uptime_percentage: number;
  average_response_time: number;
}

export interface RevenueMetrics {
  total_revenue: number;
  monthly_revenue: number;
  yearly_revenue: number;
  revenue_by_plan: {
    starter: number;
    professional: number;
    enterprise: number;
  };
  growth_percentage: number;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved';
  agency_id?: string;
  agency_name?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  assigned_to?: string;
}

export interface PerformanceMetrics {
  response_time: number;
  uptime: number;
  error_rate: number;
  throughput: number;
  timestamp: string;
}

export interface DashboardData {
  metrics: SystemMetrics;
  revenue: RevenueMetrics;
  recent_incidents: Incident[];
  performance_trends: PerformanceMetrics[];
  top_agencies: Agency[];
}