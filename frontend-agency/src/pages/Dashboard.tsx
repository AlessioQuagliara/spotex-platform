import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Globe,
  Ticket,
  Euro,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { agencyApi } from '../services/api';
import type { AgencyDashboard } from '../types';
import { Card, CardContent, CardHeader, CardTitle, MetricCard, StatusBadge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui';

const Dashboard: React.FC = () => {
  const { data: dashboard, isLoading, error } = useQuery<AgencyDashboard>({
    queryKey: ['agency-dashboard'],
    queryFn: agencyApi.getDashboard,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Errore nel caricamento</h3>
        <p className="mt-1 text-sm text-gray-500">
          Impossibile caricare i dati del dashboard. Riprova più tardi.
        </p>
      </div>
    );
  }

  if (!dashboard) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Agenzia</h1>
        <p className="mt-1 text-sm text-gray-600">
          Panoramica generale della tua agenzia e dei tuoi clienti
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Clienti Totali"
          value={dashboard.totalClients}
          icon={Users}
          change="+12% questo mese"
          changeType="positive"
        />
        <MetricCard
          title="Siti Attivi"
          value={dashboard.activeSites}
          icon={Globe}
          change={`${dashboard.siteStatus.active} attivi`}
          changeType="positive"
        />
        <MetricCard
          title="Ticket Aperti"
          value={dashboard.openTickets}
          icon={Ticket}
          change="2 urgenti"
          changeType="negative"
        />
        <MetricCard
          title="Ricavi Mensili"
          value={`€${dashboard.monthlyRevenue.toLocaleString()}`}
          icon={Euro}
          change="+8% vs mese scorso"
          changeType="positive"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Ricavi Mensili
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              Grafico ricavi - Implementazione in corso
            </div>
          </CardContent>
        </Card>

        {/* Site Status */}
        <Card>
          <CardHeader>
            <CardTitle>Stato Siti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Attivi</span>
                </div>
                <span className="text-sm font-medium">{dashboard.siteStatus.active}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-orange-500 mr-2" />
                  <span className="text-sm text-gray-600">Manutenzione</span>
                </div>
                <span className="text-sm font-medium">{dashboard.siteStatus.maintenance}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                  <span className="text-sm text-gray-600">Errori</span>
                </div>
                <span className="text-sm font-medium">{dashboard.siteStatus.error}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Recenti</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titolo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Priorità</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboard.recentTickets.slice(0, 5).map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.title}</TableCell>
                  <TableCell>Cliente #{ticket.clientId.slice(-4)}</TableCell>
                  <TableCell>
                    <StatusBadge status={ticket.priority} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={ticket.status} />
                  </TableCell>
                  <TableCell>
                    {new Date(ticket.createdAt).toLocaleDateString('it-IT')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upcoming Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Fatture in Scadenza</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numero</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Importo</TableHead>
                <TableHead>Scadenza</TableHead>
                <TableHead>Stato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboard.upcomingInvoices.slice(0, 5).map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.number}</TableCell>
                  <TableCell>Cliente #{invoice.clientId.slice(-4)}</TableCell>
                  <TableCell>€{invoice.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    {new Date(invoice.dueDate).toLocaleDateString('it-IT')}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={invoice.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;