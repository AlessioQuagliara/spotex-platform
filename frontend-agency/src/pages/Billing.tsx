import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Euro,
  Plus,
  Search,
  Send,
  Download,
  Eye,
  Calendar,
  User
} from 'lucide-react';
import { agencyApi } from '../services/api';
import type { Invoice } from '../types';
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

const Billing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const queryClient = useQueryClient();

  const { data: invoices = [], isLoading, error } = useQuery<Invoice[]>({
    queryKey: ['invoices', { status: statusFilter }],
    queryFn: () => agencyApi.getInvoices({ status: statusFilter || undefined }),
  });

  const sendInvoiceMutation = useMutation({
    mutationFn: agencyApi.sendInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Fattura inviata con successo');
    },
    onError: () => {
      toast.error('Errore nell\'invio della fattura');
    },
  });

  const handleSendInvoice = (invoiceId: string) => {
    sendInvoiceMutation.mutate(invoiceId);
  };

  const filteredInvoices = (invoices || []).filter((invoice: Invoice) => {
    const matchesSearch = !searchTerm ||
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getTotalRevenue = () => {
    return filteredInvoices
      .filter(invoice => invoice.status === 'paid')
      .reduce((total, invoice) => total + invoice.amount, 0);
  };

  const getPendingAmount = () => {
    return filteredInvoices
      .filter(invoice => invoice.status === 'sent' || invoice.status === 'overdue')
      .reduce((total, invoice) => total + invoice.amount, 0);
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
        <p className="text-gray-500">Impossibile caricare le fatture</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fatturazione</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestisci fatture e pagamenti dei tuoi clienti
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuova Fattura
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ricavi Totali</p>
                <p className="text-2xl font-bold text-gray-900">€{getTotalRevenue().toLocaleString()}</p>
              </div>
              <Euro className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Attesa</p>
                <p className="text-2xl font-bold text-gray-900">€{getPendingAmount().toLocaleString()}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fatture Totali</p>
                <p className="text-2xl font-bold text-gray-900">{filteredInvoices.length}</p>
              </div>
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cerca fatture..."
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
                <option value="draft">Bozza</option>
                <option value="sent">Inviata</option>
                <option value="paid">Pagata</option>
                <option value="overdue">Scaduta</option>
                <option value="cancelled">Annullata</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Euro className="w-5 h-5 mr-2" />
            Lista Fatture ({filteredInvoices.length})
          </CardTitle>
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
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice: Invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div className="font-medium text-gray-900">{invoice.number}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(invoice.createdAt).toLocaleDateString('it-IT')}
                    </div>
                  </TableCell>
                  <TableCell>
                    Cliente #{invoice.clientId.slice(-4)}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">€{invoice.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{invoice.currency}</div>
                  </TableCell>
                  <TableCell>
                    {new Date(invoice.dueDate).toLocaleDateString('it-IT')}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* TODO: View invoice details */}}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* TODO: Download PDF */}}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      {invoice.status === 'draft' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendInvoice(invoice.id)}
                          disabled={sendInvoiceMutation.isPending}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <Euro className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nessuna fattura trovata</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter
                  ? 'Prova a modificare i filtri di ricerca'
                  : 'Inizia creando la tua prima fattura'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Nuova Fattura</h3>
              <p className="text-sm text-gray-500 mb-4">
                Crea nuova fattura - Implementazione in corso
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Annulla
                </Button>
                <Button>
                  Crea Fattura
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;