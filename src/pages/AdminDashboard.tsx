
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import AdminDashboard from '@/components/admin/AdminDashboard';

const AdminDashboardPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // Aguardar o carregamento da autenticação

    if (!user) {
      toast.error('Acesso restrito. Apenas administradores podem acessar esta área.');
      navigate('/');
      return;
    }

    if (!user.isAdmin) {
      toast.error('Acesso restrito. Apenas administradores podem acessar esta área.');
      navigate('/');
      return;
    }
  }, [user, loading, navigate]);

  // Loading state enquanto verifica a autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Verificando acesso...</h1>
        </div>
      </div>
    );
  }

  // Se não é autorizado, mostra mensagem enquanto redireciona
  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
};

export default AdminDashboardPage;
