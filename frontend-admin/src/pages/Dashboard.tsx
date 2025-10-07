/**
 * @fileoverview Admin Dashboard Page - Overview of platform metrics and management
 * @principle KISS - Focused dashboard with essential metrics
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import { Card, MetricCard, StatusBadge } from '../components/ui';
import type { DashboardData, Agency, Incident } from '../types';
import {
  Users,
  Building,
  TrendingUp,
  AlertTriangle,
  Activity,
  DollarSign,
  Server
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data: dashboardData, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await adminApi.getDashboardData();
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Errore nel caricamento</h3>
        <p className="mt-1 text-sm text-gray-500">
          Impossibile caricare i dati del dashboard. Riprova più tardi.
        </p>
      </div>
    );
  }

  const metrics = dashboardData?.metrics;
  const revenue = dashboardData?.revenue;
  const incidents = dashboardData?.recent_incidents || [];
  const topAgencies = dashboardData?.top_agencies || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Amministrazione</h1>
        <div className="flex items-center space-x-2">
          <StatusBadge status={metrics?.system_health || 'healthy'}>
            Sistema {metrics?.system_health === 'healthy' ? 'Funzionante' :
                     metrics?.system_health === 'warning' ? 'Avvertimenti' : 'Critico'}
          </StatusBadge>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Totale Agenzie"
          value={metrics?.total_agencies || 0}
          change="+12% questo mese"
          changeType="positive"
          icon={<Building className="h-6 w-6" />}
        />
        <MetricCard
          title="Agenzie Attive"
          value={metrics?.active_agencies || 0}
          change={`${((metrics?.active_agencies || 0) / (metrics?.total_agencies || 1) * 100).toFixed(1)}% del totale`}
          changeType="neutral"
          icon={<Users className="h-6 w-6" />}
        />
        <MetricCard
          title="Siti Totali"
          value={metrics?.total_sites || 0}
          change="+8% questa settimana"
          changeType="positive"
          icon={<Server className="h-6 w-6" />}
        />
        <MetricCard
          title="Ricavi Mensili"
          value={`€${(revenue?.monthly_revenue || 0).toLocaleString()}`}
          change="+15% vs mese scorso"
          changeType="positive"
          icon={<DollarSign className="h-6 w-6" />}
        />
      </div>

      {/* Performance & Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Performance Sistema">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Uptime 30 giorni</span>
              <span className="text-sm font-medium">{metrics?.uptime_percentage || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${metrics?.uptime_percentage || 0}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tempo Risposta Medio</span>
              <span className="text-sm font-medium">{metrics?.average_response_time || 0}ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Deployment Attivi</span>
              <span className="text-sm font-medium">{metrics?.total_deployments || 0}</span>
            </div>
          </div>
        </Card>

        <Card title="Ricavi per Piano">
          <div className="space-y-3">
            {revenue?.revenue_by_plan && Object.entries(revenue.revenue_by_plan).map(([plan, amount]) => (
              <div key={plan} className="flex items-center justify-between">
                <span className="text-sm capitalize">{plan}</span>
                <span className="text-sm font-medium">€{amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Incidents & Top Agencies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Incidenti Recenti">
          <div className="space-y-3">
            {incidents.slice(0, 5).map((incident: Incident) => (
              <div key={incident.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{incident.title}</p>
                  <p className="text-xs text-gray-500">
                    {incident.agency_name && `${incident.agency_name} • `}
                    {new Date(incident.created_at).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={incident.severity as any}>
                  {incident.severity}
                </StatusBadge>
              </div>
            ))}
            {incidents.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Nessun incidente recente</p>
            )}
          </div>
        </Card>

        <Card title="Agenzie Top">
          <div className="space-y-3">
            {topAgencies.slice(0, 5).map((agency: Agency) => (
              <div key={agency.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{agency.name}</p>
                  <p className="text-xs text-gray-500">
                    {agency.total_sites} siti • €{agency.monthly_revenue.toLocaleString()}/mese
                  </p>
                </div>
                <StatusBadge status={agency.status}>
                  {agency.status}
                </StatusBadge>
              </div>
            ))}
            {topAgencies.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Nessuna agenzia trovata</p>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Azioni Rapide">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Gestisci Agenzie</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <AlertTriangle className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Visualizza Incidenti</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Report Finanziari</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Activity className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Monitor Sistema</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;