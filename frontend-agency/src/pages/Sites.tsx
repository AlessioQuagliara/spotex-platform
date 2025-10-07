import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Globe,
  Plus,
  Search,
  Settings,
  Play,
  Download,
  ExternalLink,
  Shield
} from 'lucide-react';
import { agencyApi } from '../services/api';
import type { Site } from '../types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../components/ui';
import { toast } from 'sonner';

const Sites: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  const queryClient = useQueryClient();

  const { data: sites = [], isLoading, error } = useQuery<Site[]>({
    queryKey: ['sites'],
    queryFn: () => agencyApi.getSites(),
  });

  const deployMutation = useMutation({
    mutationFn: ({ siteId, config }: { siteId: string; config: any }) =>
      agencyApi.deployWordPress(siteId, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success('Sito WordPress deployato con successo');
      setShowDeployModal(false);
    },
    onError: () => {
      toast.error('Errore nel deploy del sito');
    },
  });

  const backupMutation = useMutation({
    mutationFn: agencyApi.backupSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success('Backup completato con successo');
    },
    onError: () => {
      toast.error('Errore durante il backup');
    },
  });

  const handleDeploy = (site: Site) => {
    setSelectedSite(site);
    setShowDeployModal(true);
  };

  const handleBackup = (siteId: string) => {
    backupMutation.mutate(siteId);
  };

  const filteredSites = (sites || []).filter((site: Site) => {
    const matchesSearch = !searchTerm ||
      site.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.clientId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || site.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getSSLStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'text-green-600';
      case 'expiring': return 'text-yellow-600';
      case 'expired': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900">Errore nel caricamento</h3>
        <p className="text-gray-500">Impossibile caricare la lista siti</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Siti WordPress</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestisci i siti WordPress dei tuoi clienti
          </p>
        </div>
        <Button onClick={() => setShowDeployModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuovo Sito
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cerca siti..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Tutti gli stati</option>
                <option value="active">Attivi</option>
                <option value="pending">In Attesa</option>
                <option value="deploying">In Deploy</option>
                <option value="maintenance">Manutenzione</option>
                <option value="error">Errore</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sites Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Lista Siti ({filteredSites.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dominio</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>WordPress</TableHead>
                <TableHead>SSL</TableHead>
                <TableHead>Ultimo Backup</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(filteredSites || []).map((site: Site) => (
                <TableRow key={site.id}>
                  <TableCell>
                    <div className="font-medium text-gray-900">{site.domain}</div>
                    <div className="text-sm text-gray-500">
                      ID: {site.id.slice(-8)}
                    </div>
                  </TableCell>
                  <TableCell>
                    Cliente #{site.clientId.slice(-4)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {site.wordpressVersion ? (
                        <span>v{site.wordpressVersion}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                    {site.theme && (
                      <div className="text-xs text-gray-500">
                        Tema: {site.theme}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center text-sm ${getSSLStatusColor(site.sslStatus)}`}>
                      <Shield className="w-4 h-4 mr-1" />
                      <StatusBadge status={site.sslStatus} />
                    </div>
                    {site.sslExpiry && (
                      <div className="text-xs text-gray-500">
                        Scade: {new Date(site.sslExpiry).toLocaleDateString('it-IT')}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {site.lastBackup ? (
                      <div className="text-sm">
                        {new Date(site.lastBackup).toLocaleDateString('it-IT')}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Mai</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={site.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {site.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://${site.domain}`, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBackup(site.id)}
                        disabled={backupMutation.isPending}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      {site.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeploy(site)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* TODO: Site settings */}}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSites.length === 0 && (
            <div className="text-center py-12">
              <Globe className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nessun sito trovato</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter
                  ? 'Prova a modificare i filtri di ricerca'
                  : 'Inizia creando il tuo primo sito WordPress'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deploy Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedSite ? 'Deploy Sito WordPress' : 'Nuovo Sito WordPress'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {selectedSite
                  ? `Deploy sito per ${selectedSite.domain}`
                  : 'Crea nuovo sito WordPress - Implementazione in corso'
                }
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeployModal(false);
                    setSelectedSite(null);
                  }}
                >
                  Annulla
                </Button>
                <Button
                  onClick={() => {
                    if (selectedSite) {
                      deployMutation.mutate({
                        siteId: selectedSite.id,
                        config: { theme: 'twentytwentyfour', plugins: ['wordpress-seo', 'contact-form-7'] }
                      });
                    }
                  }}
                  disabled={deployMutation.isPending}
                >
                  {deployMutation.isPending ? 'Deploy in corso...' : 'Deploy'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sites;