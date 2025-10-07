/**
 * @fileoverview API services for Spotex Admin Frontend
 * @principle KISS - Simple, focused API calls
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminApi = {
  // Dashboard
  getDashboardData: () => api.get('/admin/dashboard'),

  // Agencies
  getAgencies: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/admin/agencies', { params }),

  getAgency: (id: string) => api.get(`/admin/agencies/${id}`),

  updateAgency: (id: string, data: any) => api.put(`/admin/agencies/${id}`, data),

  suspendAgency: (id: string) => api.post(`/admin/agencies/${id}/suspend`),

  activateAgency: (id: string) => api.post(`/admin/agencies/${id}/activate`),

  // System Monitoring
  getSystemMetrics: () => api.get('/admin/metrics'),

  getPerformanceData: (period: string) => api.get(`/admin/performance?period=${period}`),

  // Incidents
  getIncidents: (params?: { status?: string; severity?: string }) =>
    api.get('/admin/incidents', { params }),

  getIncident: (id: string) => api.get(`/admin/incidents/${id}`),

  updateIncident: (id: string, data: any) => api.put(`/admin/incidents/${id}`, data),

  resolveIncident: (id: string, resolution: string) =>
    api.post(`/admin/incidents/${id}/resolve`, { resolution }),

  // Revenue & Reporting
  getRevenueReport: (period: string) => api.get(`/admin/revenue?period=${period}`),

  getFinancialReport: (params: { start_date: string; end_date: string }) =>
    api.get('/admin/financial-report', { params }),

  // System Management
  restartService: (serviceName: string) => api.post(`/admin/services/${serviceName}/restart`),

  getSystemLogs: (service?: string, lines?: number) =>
    api.get('/admin/logs', { params: { service, lines } }),
};

export default api;