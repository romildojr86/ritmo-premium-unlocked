
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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

  const calculateProgress = (expireDate: string) => {
    const totalDays = 7; // Total de dias do trial
    const daysRemaining = calculateDaysRemaining(expireDate);
    const daysUsed = totalDays - daysRemaining;
    return Math.min(100, Math.max(0, (daysUsed / totalDays) * 100));
  };

  const daysRemaining = calculateDaysRemaining(expiresAt);
  const progressValue = calculateProgress(expiresAt);

  const handleUpgradeClick = () => {
    // Futuramente pode abrir checkout ou página de upgrade
    console.log('Redirecionando para upgrade...');
  };

  return (
    <Alert className="border-amber-200 bg-amber-50 mb-6">
      <Clock className="h-4 w-4 text-amber-600" />
      <AlertDescription className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1">
            <p className="font-medium text-amber-800 mb-1">
              ⏳ Seu acesso Premium gratuito termina em {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}.
            </p>
            <p className="text-amber-700 text-sm mb-3">
              Aproveite todos os recursos e, se curtir, continue com a gente sem perder o ritmo.
            </p>
            
            {/* Barra de progresso */}
            <div className="w-full max-w-md">
              <Progress 
                value={progressValue} 
                className="h-2 bg-amber-100 rounded-full"
              />
              <p className="text-xs text-amber-600 mt-1">
                Faltam {daysRemaining} de 7 dias
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleUpgradeClick}
            className="bg-green-500 hover:bg-green-600 text-white whitespace-nowrap"
            size="sm"
          >
            Quero continuar com o Premium
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default TrialWarning;
