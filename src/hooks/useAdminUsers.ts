
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  nome: string;
  email: string;
  plano?: string;
  status?: string;
  assinou_em?: string;
  expira_em?: string;
  criado_em?: string;
  admin?: boolean;
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast.error('Erro ao carregar dados dos usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrar usuários baseado na busca e filtros
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = planFilter === 'todos' || user.plano === planFilter;
    const matchesStatus = statusFilter === 'todos' || user.status === statusFilter;
    
    return matchesSearch && matchesPlan && matchesStatus;
  });

  // Contadores
  const totalUsers = users.length;
  const premiumUsers = users.filter(user => user.status === 'premium').length;
  const freeUsers = users.filter(user => user.status === 'free' || !user.status).length;

  return {
    users: filteredUsers,
    loading,
    searchTerm,
    setSearchTerm,
    planFilter,
    setPlanFilter,
    statusFilter,
    setStatusFilter,
    stats: {
      total: totalUsers,
      premium: premiumUsers,
      free: freeUsers
    },
    refetch: fetchUsers
  };
};
