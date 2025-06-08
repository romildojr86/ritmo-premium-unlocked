
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
  
  const isAdmin = user?.email === 'romildo@romildo.online';

  const handleAdminAccess = () => {
    console.log('Clicou no botão admin, usuário:', user?.email);
    console.log('Navegando para /adm');
    navigate('/adm');
  };

  console.log('DashboardHeader - usuário atual:', user?.email);
  console.log('DashboardHeader - é admin?', isAdmin);

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
            👉 Painel Admin
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
