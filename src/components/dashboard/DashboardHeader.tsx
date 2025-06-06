
import React from 'react';
import { Button } from "@/components/ui/button";
import WelcomeSection from './WelcomeSection';

interface DashboardHeaderProps {
  userName: string;
  onLogout: () => void;
}

const DashboardHeader = ({ userName, onLogout }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <WelcomeSection userName={userName} />
      <Button 
        onClick={onLogout}
        variant="outline"
        className="text-gray-600 hover:text-gray-800"
      >
        Sair
      </Button>
    </div>
  );
};

export default DashboardHeader;
