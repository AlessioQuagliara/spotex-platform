// Types for Agency Frontend
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
  sites: Site[];
  tickets: Ticket[];
  invoices: Invoice[];
}

export interface Site {
  id: string;
  clientId: string;
  domain: string;
  status: 'pending' | 'deploying' | 'active' | 'maintenance' | 'error';
  wordpressVersion?: string;
  theme?: string;
  plugins: string[];
  createdAt: string;
  updatedAt: string;
  lastBackup?: string;
  sslStatus: 'valid' | 'expiring' | 'expired' | 'none';
  sslExpiry?: string;
}

export interface Ticket {
  id: string;
  clientId: string;
  siteId?: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'feature' | 'bug' | 'general';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  message: string;
  createdAt: string;
  isInternal: boolean;
}

export interface Invoice {
  id: string;
  clientId: string;
  number: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  paidAt?: string;
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface AgencyDashboard {
  totalClients: number;
  activeSites: number;
  openTickets: number;
  monthlyRevenue: number;
  recentTickets: Ticket[];
  upcomingInvoices: Invoice[];
  siteStatus: {
    active: number;
    maintenance: number;
    error: number;
  };
  revenueChart: {
    month: string;
    revenue: number;
  }[];
}

export interface AgencySettings {
  id: string;
  agencyName: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  domain: string;
  email: string;
  phone?: string;
  address?: string;
  taxId?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    iban: string;
    swift: string;
  };
}