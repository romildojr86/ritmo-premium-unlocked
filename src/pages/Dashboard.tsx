
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erro ao fazer logout');
    } else {
      toast.success('Logout realizado com sucesso!');
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Dashboard - Ritmo e Progresso
          </h1>
          <p className="text-gray-600 mb-8">
            Bem-vindo! Sua conta foi criada com sucesso.
          </p>
          
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full"
          >
            Fazer Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
