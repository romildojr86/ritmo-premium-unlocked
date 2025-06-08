
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Clock } from 'lucide-react';

interface TrialWarningProps {
  expiresAt: string;
}

const TrialWarning = ({ expiresAt }: TrialWarningProps) => {
  const calculateDaysRemaining = (expireDate: string) => {
    const now = new Date();
    const expire = new Date(expireDate);
    const diffTime = expire.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const daysRemaining = calculateDaysRemaining(expiresAt);

  const handleUpgradeClick = () => {
    // Futuramente pode abrir checkout ou página de upgrade
    console.log('Redirecionando para upgrade...');
  };

  return (
    <Alert className="border-amber-200 bg-amber-50 mb-6">
      <Clock className="h-4 w-4 text-amber-600" />
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1">
          <p className="font-medium text-amber-800 mb-1">
            ⏳ Seu acesso Premium gratuito termina em {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}.
          </p>
          <p className="text-amber-700 text-sm">
            Aproveite todos os recursos e, se curtir, continue com a gente sem perder o ritmo.
          </p>
        </div>
        <Button 
          onClick={handleUpgradeClick}
          className="bg-green-500 hover:bg-green-600 text-white whitespace-nowrap"
          size="sm"
        >
          Quero continuar com o Premium
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default TrialWarning;
