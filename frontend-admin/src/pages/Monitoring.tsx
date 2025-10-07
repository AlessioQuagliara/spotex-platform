/**
 * @fileoverview System Monitoring Page - Real-time system health and performance
 * @principle KISS - Clear system status overview
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import { Card, MetricCard, StatusBadge } from '../components/ui';
import type { SystemMetrics } from '../types';
import {
  Activity,
  Server,
  Clock,
  AlertTriangle,
  CheckCircle,
  Zap,
  Database,
  Globe
} from 'lucide-react';

const Monitoring: React.FC = () => {
  const [timeRange, setTimeRange] = useState('1h');

  const { data: metrics, isLoading: metricsLoading } = useQuery<SystemMetrics>({
    queryKey: ['system-metrics'],
    queryFn: async () => {
      const response = await adminApi.getSystemMetrics();
      return response.data;
    },
    refetchInterval: 30000,
  });

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  if (metricsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Monitoraggio Sistema</h1>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="1h">Ultima Ora</option>
            <option value="24h">Ultime 24 Ore</option>
            <option value="7d">Ultimi 7 Giorni</option>
            <option value="30d">Ultimi 30 Giorni</option>
          </select>
          <div className="flex items-center space-x-2">
            {getHealthIcon(metrics?.system_health || 'healthy')}
            <span className={`text-sm font-medium ${getHealthColor(metrics?.system_health || 'healthy')}`}>
              Sistema {metrics?.system_health === 'healthy' ? 'Sano' :
                       metrics?.system_health === 'warning' ? 'Avvertimenti' : 'Critico'}
            </span>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Uptime Sistema"
          value={`${metrics?.uptime_percentage || 0}%`}
          change="99.9% target"
          changeType="positive"
          icon={<Activity className="h-6 w-6" />}
        />
        <MetricCard
          title="Tempo Risposta"
          value={`${metrics?.average_response_time || 0}ms`}
          change="-5ms vs ieri"
          changeType="positive"
          icon={<Clock className="h-6 w-6" />}
        />
        <MetricCard
          title="Deployment Attivi"
          value={metrics?.total_deployments || 0}
          change="2 in corso"
          changeType="neutral"
          icon={<Server className="h-6 w-6" />}
        />
        <MetricCard
          title="Error Rate"
          value="0.01%"
          change="-0.02% vs ieri"
          changeType="positive"
          icon={<AlertTriangle className="h-6 w-6" />}
        />
      </div>

      {/* Service Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Stato Servizi">
          <div className="space-y-4">
            {[
              { name: 'Backend API', status: 'healthy', uptime: '99.9%', responseTime: '45ms' },
              { name: 'Auth Service', status: 'healthy', uptime: '99.8%', responseTime: '32ms' },
              { name: 'Deployment Service', status: 'healthy', uptime: '99.7%', responseTime: '78ms' },
              { name: 'Ticket Service', status: 'warning', uptime: '98.5%', responseTime: '156ms' },
              { name: 'Domain Service', status: 'healthy', uptime: '99.9%', responseTime: '23ms' },
              { name: 'Database', status: 'healthy', uptime: '99.9%', responseTime: '12ms' },
              { name: 'Redis Cache', status: 'healthy', uptime: '99.9%', responseTime: '5ms' },
            ].map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getHealthIcon(service.status)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{service.name}</p>
                    <p className="text-xs text-gray-500">
                      Uptime: {service.uptime} • Response: {service.responseTime}
                    </p>
                  </div>
                </div>
                <StatusBadge status={service.status as any}>
                  {service.status === 'healthy' ? 'Sano' :
                   service.status === 'warning' ? 'Avvertimento' : 'Critico'}
                </StatusBadge>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Performance in Tempo Reale">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">CPU Usage</span>
              <span className="text-sm font-medium">23%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '23%' }}></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Memory Usage</span>
              <span className="text-sm font-medium">67%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }}></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Disk Usage</span>
              <span className="text-sm font-medium">45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Network I/O</span>
              <span className="text-sm font-medium">12 MB/s</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card title="Attività Recente">
        <div className="space-y-3">
          {[
            { time: '2 minuti fa', event: 'Deployment completato per agency-001', type: 'success' },
            { time: '5 minuti fa', event: 'Nuova agenzia registrata: TechCorp SRL', type: 'info' },
            { time: '8 minuti fa', event: 'Backup automatico completato', type: 'success' },
            { time: '12 minuti fa', event: 'Avvertimento: CPU usage elevato su server-2', type: 'warning' },
            { time: '15 minuti fa', event: 'Ticket risolto #1234', type: 'success' },
            { time: '18 minuti fa', event: 'Domain registrato: example.com', type: 'info' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.event}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card title="Azioni di Manutenzione">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <Database className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Backup DB</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <Zap className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Clear Cache</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <Server className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Restart Services</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <Globe className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">SSL Certificates</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Monitoring;