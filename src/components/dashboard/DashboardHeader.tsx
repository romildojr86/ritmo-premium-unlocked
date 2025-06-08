
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import WelcomeSection from './WelcomeSection';

interface DashboardHeaderProps {
  userName: string;
  onLogout: () => void;
}

const DashboardHeader = ({ userName, onLogout }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isAdmin = user?.isAdmin || false;

  const handleAdminAccess = () => {
    console.log('Clicou no botão admin');
    console.log('Usuário:', user?.email);
    console.log('isAdmin:', user?.isAdmin);
    console.log('Navegando para /admin-dashboard');
    navigate('/admin-dashboard');
  };

  console.log('DashboardHeader - Renderizando com isAdmin:', isAdmin);

  return (
    <div className="flex justify-between items-center">
      <WelcomeSection userName={userName} />
      <div className="flex gap-3 items-center">
        {isAdmin && (
          <Button 
            onClick={handleAdminAccess}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            👑 Painel Admin
          </Button>
        )}
        <Button 
          onClick={onLogout}
          variant="outline"
          className="text-gray-600 hover:text-gray-800"
        >
          Sair
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
