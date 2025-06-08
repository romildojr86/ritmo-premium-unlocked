
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import AdminDashboard from '@/components/admin/AdminDashboard';

const Adm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Verificar se o usuário está logado e tem o email correto
  const isAuthorized = user?.email === 'romildo@romildo.online';

  useEffect(() => {
    if (!user) {
      toast.error('Você precisa estar logado para acessar esta página');
      navigate('/auth');
      return;
    }

    if (!isAuthorized) {
      toast.error('Acesso restrito - Apenas administradores podem acessar');
      navigate('/');
      return;
    }
  }, [user, isAuthorized, navigate]);

  // Loading state enquanto verifica a autenticação
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Verificando acesso...</h1>
        </div>
      </div>
    );
  }

  // Se não é autorizado, mostra mensagem enquanto redireciona
  if (!isAuthorized) {
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

export default Adm;
