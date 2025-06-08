
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import AdminDashboard from '@/components/admin/AdminDashboard';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Verificar se o usuário está logado e tem o email correto
  const isAuthorized = user?.email === 'romildo@romildo.online';

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!isAuthorized) {
      toast.error('Acesso restrito');
      navigate('/');
      return;
    }
  }, [user, isAuthorized, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Carregando...</h1>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Redirecionando...</h1>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
};

export default Admin;
