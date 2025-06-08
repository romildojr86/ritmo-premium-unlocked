
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import UserDetailsModal from './UserDetailsModal';

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

interface AdminUsersTableProps {
  users: AdminUser[];
}

const AdminUsersTable = ({ users }: AdminUsersTableProps) => {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch {
      return '-';
    }
  };

  const getPlanDisplay = (plano?: string) => {
    switch (plano) {
      case 'trial':
        return 'Teste Premium (7 dias)';
      case 'premium':
        return 'Premium';
      case 'free':
        return 'Gratuito';
      default:
        return 'Gratuito';
    }
  };

  const getStatusBadge = (status?: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'premium':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'free':
        return `${baseClasses} bg-blue-100 text-blue-800`;
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
        return status || 'Gratuito';
    }
  };

  const getExpirationDisplay = (expiraEm?: string) => {
    if (!expiraEm) return { text: '-', className: 'text-gray-900' };
    
    try {
      const expirationDate = new Date(expiraEm);
      const now = new Date();
      const daysLeft = differenceInDays(expirationDate, now);
      
      if (daysLeft < 0) {
        return { text: 'Expirado', className: 'text-red-600 font-bold' };
      } else if (daysLeft === 0) {
        return { text: 'Expira hoje', className: 'text-red-600 font-bold' };
      } else if (daysLeft <= 2) {
        return { text: `${daysLeft} dias`, className: 'text-red-600 font-bold' };
      } else {
        return { text: `${daysLeft} dias`, className: 'text-gray-900' };
      }
    } catch {
      return { text: '-', className: 'text-gray-900' };
    }
  };

  const handleRowClick = (user: AdminUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">ID</TableHead>
                <TableHead className="font-semibold text-gray-700">Email</TableHead>
                <TableHead className="font-semibold text-gray-700">Plano</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Criado em</TableHead>
                <TableHead className="font-semibold text-gray-700">Expira em</TableHead>
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
                users.map((user) => {
                  const expirationInfo = getExpirationDisplay(user.expira_em);
                  return (
                    <TableRow 
                      key={user.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(user)}
                    >
                      <TableCell className="font-mono text-xs">
                        {user.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {getPlanDisplay(user.plano)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={getStatusBadge(user.status)}>
                          {getStatusText(user.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(user.criado_em)}</TableCell>
                      <TableCell>
                        <span className={`text-sm ${expirationInfo.className}`}>
                          {expirationInfo.text}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default AdminUsersTable;
