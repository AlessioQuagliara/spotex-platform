/**
 * @fileoverview Agencies Management Page - CRUD operations for agencies
 * @principle KISS - Simple agency management interface
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import { Card, Button, StatusBadge, Table } from '../components/ui';
import type { Agency } from '../types';
import { Search, Plus, Edit, Ban, CheckCircle, AlertTriangle, Building } from 'lucide-react';
import { toast } from 'sonner';

const Agencies: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data: agencies, isLoading, error } = useQuery<Agency[]>({
    queryKey: ['agencies', searchTerm, statusFilter],
    queryFn: async () => {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== 'all') params.status = statusFilter;

      const response = await adminApi.getAgencies(params);
      return response.data.data || [];
    },
  });

  const suspendMutation = useMutation({
    mutationFn: (agencyId: string) => adminApi.suspendAgency(agencyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      toast.success('Agenzia sospesa con successo');
    },
    onError: () => {
      toast.error('Errore durante la sospensione dell\'agenzia');
    },
  });

  const activateMutation = useMutation({
    mutationFn: (agencyId: string) => adminApi.activateAgency(agencyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      toast.success('Agenzia attivata con successo');
    },
    onError: () => {
      toast.error('Errore durante l\'attivazione dell\'agenzia');
    },
  });

  const handleSuspend = (agencyId: string) => {
    if (window.confirm('Sei sicuro di voler sospendere questa agenzia?')) {
      suspendMutation.mutate(agencyId);
    }
  };

  const handleActivate = (agencyId: string) => {
    activateMutation.mutate(agencyId);
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
          Impossibile caricare la lista delle agenzie.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestione Agenzie</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuova Agenzia
        </Button>
      </div>

      {/* Filters */}
      <Card title="Filtri e Ricerca" className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cerca agenzia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Tutti gli Stati</option>
              <option value="active">Attive</option>
              <option value="inactive">Inattive</option>
              <option value="suspended">Sospese</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Agencies Table */}
      <Card title="Lista Agenzie">
        <Table
          headers={['Nome', 'Dominio', 'Piano', 'Stato', 'Siti', 'Ricavi Mensili', 'Azioni']}
        >
          {agencies?.map((agency) => (
            <tr key={agency.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{agency.name}</div>
                <div className="text-sm text-gray-500">{agency.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {agency.domain}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                  {agency.plan}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={agency.status}>
                  {agency.status === 'active' ? 'Attiva' :
                   agency.status === 'inactive' ? 'Inattiva' : 'Sospesa'}
                </StatusBadge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {agency.total_sites}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                €{agency.monthly_revenue.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button size="sm" variant="secondary">
                  <Edit className="h-4 w-4" />
                </Button>
                {agency.status === 'active' ? (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleSuspend(agency.id)}
                    disabled={suspendMutation.isPending}
                  >
                    <Ban className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleActivate(agency.id)}
                    disabled={activateMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </Table>

        {agencies?.length === 0 && (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nessuna agenzia trovata</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Prova a modificare i filtri di ricerca.'
                : 'Inizia creando la tua prima agenzia.'}
            </p>
          </div>
        )}
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{agencies?.length || 0}</div>
          <div className="text-sm text-gray-600">Totale Agenzie</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {agencies?.filter(a => a.status === 'active').length || 0}
          </div>
          <div className="text-sm text-gray-600">Attive</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {agencies?.reduce((sum, a) => sum + a.total_sites, 0) || 0}
          </div>
          <div className="text-sm text-gray-600">Siti Totali</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            €{agencies?.reduce((sum, a) => sum + a.monthly_revenue, 0).toLocaleString() || 0}
          </div>
          <div className="text-sm text-gray-600">Ricavi Mensili</div>
        </div>
      </div>
    </div>
  );
};

export default Agencies;