/**
 * @fileoverview Incident Management Page - Handle system incidents and support tickets
 * @principle KISS - Simple incident tracking and resolution
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import { Card, Button, StatusBadge, Table } from '../components/ui';
import type { Incident } from '../types';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const Incidents: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data: incidents, isLoading, error } = useQuery<Incident[]>({
    queryKey: ['incidents', statusFilter, severityFilter],
    queryFn: async () => {
      const params: any = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (severityFilter !== 'all') params.severity = severityFilter;

      const response = await adminApi.getIncidents(params);
      return response.data || [];
    },
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, resolution }: { id: string; resolution: string }) =>
      adminApi.resolveIncident(id, resolution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      toast.success('Incidente risolto con successo');
    },
    onError: () => {
      toast.error('Errore durante la risoluzione dell\'incidente');
    },
  });

  const handleResolve = (incidentId: string) => {
    const resolution = prompt('Descrivi la risoluzione dell\'incidente:');
    if (resolution && resolution.trim()) {
      resolveMutation.mutate({ id: incidentId, resolution: resolution.trim() });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
          Impossibile caricare la lista degli incidenti.
        </p>
      </div>
    );
  }

  const activeIncidents = incidents?.filter(i => i.status === 'open' || i.status === 'investigating') || [];
  const resolvedIncidents = incidents?.filter(i => i.status === 'resolved') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestione Incidenti</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium">{activeIncidents.length} incidenti attivi</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Incidenti Attivi" className="text-center">
          <div className="text-2xl font-bold text-red-600">{activeIncidents.length}</div>
          <div className="text-sm text-gray-600">Incidenti Attivi</div>
        </Card>
        <Card title="Critici" className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {incidents?.filter(i => i.severity === 'critical').length || 0}
          </div>
          <div className="text-sm text-gray-600">Critici</div>
        </Card>
        <Card title="In Investigazione" className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {incidents?.filter(i => i.status === 'investigating').length || 0}
          </div>
          <div className="text-sm text-gray-600">In Investigazione</div>
        </Card>
        <Card title="Risolti (24h)" className="text-center">
          <div className="text-2xl font-bold text-green-600">{resolvedIncidents.length}</div>
          <div className="text-sm text-gray-600">Risolti (24h)</div>
        </Card>
      </div>

      {/* Filters */}
      <Card title="Filtri" className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Tutti gli Stati</option>
              <option value="open">Aperti</option>
              <option value="investigating">In Investigazione</option>
              <option value="resolved">Risolti</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Severità</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Tutte le Severità</option>
              <option value="critical">Critica</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Bassa</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Incidents Table */}
      <Card title="Lista Incidenti">
        <Table
          headers={['Titolo', 'Severità', 'Stato', 'Agenzia', 'Creato', 'Assegnato', 'Azioni']}
        >
          {incidents?.map((incident) => (
            <tr key={incident.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{incident.title}</div>
                <div className="text-sm text-gray-500 truncate max-w-xs">{incident.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getSeverityColor(incident.severity)}`}>
                  {incident.severity}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={incident.status}>
                  {incident.status === 'open' ? 'Aperto' :
                   incident.status === 'investigating' ? 'Investigazione' : 'Risolto'}
                </StatusBadge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {incident.agency_name || 'Sistema'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(incident.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {incident.assigned_to || 'Non assegnato'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                {incident.status !== 'resolved' && (
                  <Button
                    size="sm"
                    onClick={() => handleResolve(incident.id)}
                    disabled={resolveMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Risolvi
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </Table>

        {incidents?.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nessun incidente trovato</h3>
            <p className="mt-1 text-sm text-gray-500">
              Il sistema è stabile e funzionante.
            </p>
          </div>
        )}
      </Card>

      {/* Recent Activity */}
      <Card title="Attività Recente">
        <div className="space-y-3">
          {[
            { time: '5 minuti fa', action: 'Incidente #123 risolto da admin@spotex.it', type: 'resolved' },
            { time: '12 minuti fa', action: 'Nuovo incidente critico: Database connection timeout', type: 'created' },
            { time: '18 minuti fa', action: 'Incidente #121 assegnato a dev-team', type: 'assigned' },
            { time: '25 minuti fa', action: 'Incidente #119 aggiornato con nuove informazioni', type: 'updated' },
            { time: '32 minuti fa', action: 'Incidente #118 risolto automaticamente', type: 'resolved' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'resolved' ? 'bg-green-500' :
                activity.type === 'created' ? 'bg-red-500' :
                activity.type === 'assigned' ? 'bg-blue-500' : 'bg-yellow-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Incidents;