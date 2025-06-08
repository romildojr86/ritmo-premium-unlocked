
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface AdminFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  planFilter: string;
  setPlanFilter: (filter: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
}

const AdminFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  planFilter, 
  setPlanFilter,
  statusFilter,
  setStatusFilter 
}: AdminFiltersProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="w-full md:w-48">
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por plano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os planos</SelectItem>
              <SelectItem value="gratuito">Gratuito</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="premium-mensal">Premium Mensal</SelectItem>
              <SelectItem value="premium-anual">Premium Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="premium">Ativo</SelectItem>
              <SelectItem value="free">Gratuito</SelectItem>
              <SelectItem value="expired_trial">Expirado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AdminFilters;
