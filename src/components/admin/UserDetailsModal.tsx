
import React from 'react';
import { X, Crown, Calendar, Mail, User, Clock, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays } from 'date-fns';
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
  admin?: boolean;
}

interface UserDetailsModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailsModal = ({ user, isOpen, onClose }: UserDetailsModalProps) => {
  if (!isOpen || !user) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch {
      return '-';
    }
  };

  const getExpirationInfo = (expiraEm?: string) => {
    if (!expiraEm) return { text: '-', isExpired: false, daysLeft: 0 };
    
    try {
      const expirationDate = new Date(expiraEm);
      const now = new Date();
      const daysLeft = differenceInDays(expirationDate, now);
      
      if (daysLeft < 0) {
        return { text: 'Expirado', isExpired: true, daysLeft: 0 };
      } else if (daysLeft === 0) {
        return { text: 'Expira hoje', isExpired: false, daysLeft: 0 };
      } else {
        return { text: `${daysLeft} dias restantes`, isExpired: false, daysLeft };
      }
    } catch {
      return { text: '-', isExpired: false, daysLeft: 0 };
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
    switch (status) {
      case 'premium':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'free':
        return <Badge className="bg-blue-100 text-blue-800">Gratuito</Badge>;
      case 'expired_trial':
        return <Badge className="bg-red-100 text-red-800">Expirado</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">-</Badge>;
    }
  };

  const expirationInfo = getExpirationInfo(user.expira_em);

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5" />
              Detalhes do Usuário
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">ID do Usuário</label>
                <p className="mt-1 text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded">
                  {user.id}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>
            </div>

            {/* Plan and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Crown className="h-4 w-4" />
                  Plano Atual
                </label>
                <p className="mt-1 text-sm text-gray-900">{getPlanDisplay(user.plano)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  {getStatusBadge(user.status)}
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Data de Criação
                </label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(user.criado_em)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Data de Assinatura
                </label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(user.assinou_em)}</p>
              </div>
            </div>

            {/* Expiration */}
            {user.expira_em && (
              <div>
                <label className="text-sm font-medium text-gray-500">Expiração</label>
                <div className="mt-1 space-y-2">
                  <p className="text-sm text-gray-900">{formatDate(user.expira_em)}</p>
                  <p className={`text-sm font-medium ${
                    expirationInfo.isExpired 
                      ? 'text-red-600' 
                      : expirationInfo.daysLeft <= 2 
                        ? 'text-red-600 font-bold' 
                        : 'text-green-600'
                  }`}>
                    {expirationInfo.text}
                  </p>
                </div>
              </div>
            )}

            {/* Admin Status */}
            {user.admin && (
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  Privilégios
                </label>
                <div className="mt-1">
                  <Badge className="bg-purple-100 text-purple-800">
                    👑 Administrador
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetailsModal;
