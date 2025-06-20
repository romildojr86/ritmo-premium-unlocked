
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import AdminDashboard from '@/components/admin/AdminDashboard';

const AdminDashboardPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('=== AdminDashboard useEffect ===');
    console.log('Loading:', loading);
    console.log('User:', user);
    console.log('User isAdmin:', user?.isAdmin);

    if (loading) {
      console.log('Ainda carregando, aguardando...');
      return;
    }

    if (!user) {
      console.log('Usuário não logado, redirecionando para home');
      toast.error('Acesso restrito. Apenas administradores podem acessar esta área.');
      navigate('/');
      return;
    }

    if (!user.isAdmin) {
      console.log('Usuário logado mas não é admin, redirecionando para home');
      toast.error('Acesso restrito. Apenas administradores podem acessar esta área.');
      navigate('/');
      return;
    }

    console.log('✅ Acesso autorizado ao painel admin');
  }, [user, loading, navigate]);

  // Loading state enquanto verifica a autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Verificando acesso...</h1>
          <p className="text-gray-600">Carregando dados do usuário...</p>
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
