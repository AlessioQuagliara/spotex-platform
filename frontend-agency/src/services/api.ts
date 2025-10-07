import axios from 'axios';
import type {
  Client,
  Site,
  Ticket,
  Invoice,
  AgencyDashboard,
  AgencySettings,
  TicketMessage
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agency_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Agency API endpoints
export const agencyApi = {
  // Dashboard
  getDashboard: async (): Promise<AgencyDashboard> => {
    const response = await api.get('/agency/dashboard');
    return response.data;
  },

  // Clients
  getClients: async (params?: { status?: string; search?: string }): Promise<Client[]> => {
    const response = await api.get('/agency/clients', { params });
    return response.data;
  },

  getClient: async (id: string): Promise<Client> => {
    const response = await api.get(`/agency/clients/${id}`);
    return response.data;
  },

  createClient: async (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'sites' | 'tickets' | 'invoices'>): Promise<Client> => {
    const response = await api.post('/agency/clients', data);
    return response.data;
  },

  updateClient: async (id: string, data: Partial<Client>): Promise<Client> => {
    const response = await api.put(`/agency/clients/${id}`, data);
    return response.data;
  },

  deleteClient: async (id: string): Promise<void> => {
    await api.delete(`/agency/clients/${id}`);
  },

  // Sites
  getSites: async (clientId?: string): Promise<Site[]> => {
    const response = await api.get('/agency/sites', { params: { clientId } });
    return response.data;
  },

  getSite: async (id: string): Promise<Site> => {
    const response = await api.get(`/agency/sites/${id}`);
    return response.data;
  },

  createSite: async (data: Omit<Site, 'id' | 'createdAt' | 'updatedAt'>): Promise<Site> => {
    const response = await api.post('/agency/sites', data);
    return response.data;
  },

  updateSite: async (id: string, data: Partial<Site>): Promise<Site> => {
    const response = await api.put(`/agency/sites/${id}`, data);
    return response.data;
  },

  deleteSite: async (id: string): Promise<void> => {
    await api.delete(`/agency/sites/${id}`);
  },

  deployWordPress: async (siteId: string, config: { theme?: string; plugins?: string[] }): Promise<void> => {
    await api.post(`/agency/sites/${siteId}/deploy`, config);
  },

  backupSite: async (siteId: string): Promise<void> => {
    await api.post(`/agency/sites/${siteId}/backup`);
  },

  // Tickets
  getTickets: async (params?: { status?: string; priority?: string; clientId?: string }): Promise<Ticket[]> => {
    const response = await api.get('/agency/tickets', { params });
    return response.data;
  },

  getTicket: async (id: string): Promise<Ticket> => {
    const response = await api.get(`/agency/tickets/${id}`);
    return response.data;
  },

  createTicket: async (data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'resolvedAt' | 'messages'>): Promise<Ticket> => {
    const response = await api.post('/agency/tickets', data);
    return response.data;
  },

  updateTicket: async (id: string, data: Partial<Ticket>): Promise<Ticket> => {
    const response = await api.put(`/agency/tickets/${id}`, data);
    return response.data;
  },

  addTicketMessage: async (ticketId: string, message: string, isInternal: boolean = false): Promise<TicketMessage> => {
    const response = await api.post(`/agency/tickets/${ticketId}/messages`, { message, isInternal });
    return response.data;
  },

  // Invoices
  getInvoices: async (params?: { status?: string; clientId?: string }): Promise<Invoice[]> => {
    const response = await api.get('/agency/invoices', { params });
    return response.data;
  },

  getInvoice: async (id: string): Promise<Invoice> => {
    const response = await api.get(`/agency/invoices/${id}`);
    return response.data;
  },

  createInvoice: async (data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'paidAt'>): Promise<Invoice> => {
    const response = await api.post('/agency/invoices', data);
    return response.data;
  },

  updateInvoice: async (id: string, data: Partial<Invoice>): Promise<Invoice> => {
    const response = await api.put(`/agency/invoices/${id}`, data);
    return response.data;
  },

  sendInvoice: async (id: string): Promise<void> => {
    await api.post(`/agency/invoices/${id}/send`);
  },

  // Settings
  getSettings: async (): Promise<AgencySettings> => {
    const response = await api.get('/agency/settings');
    return response.data;
  },

  updateSettings: async (data: Partial<AgencySettings>): Promise<AgencySettings> => {
    const response = await api.put('/agency/settings', data);
    return response.data;
  },
};