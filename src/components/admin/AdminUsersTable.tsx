
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AdminUser {
  id: string;
  nome: string;
  email: string;
  plano?: string;
  status?: string;
  assinou_em?: string;
  expira_em?: string;
  criado_em?: string;
}

interface AdminUsersTableProps {
  users: AdminUser[];
}

const AdminUsersTable = ({ users }: AdminUsersTableProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch {
      return '-';
    }
  };

  const getStatusBadge = (status?: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'premium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'free':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'expired_trial':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'premium':
        return 'Ativo';
      case 'free':
        return 'Gratuito';
      case 'expired_trial':
        return 'Expirado';
      default:
        return status || '-';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Expira em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs">
                    {user.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {user.plano || 'Não definido'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={getStatusBadge(user.status)}>
                      {getStatusText(user.status)}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(user.criado_em)}</TableCell>
                  <TableCell>{formatDate(user.expira_em)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsersTable;
