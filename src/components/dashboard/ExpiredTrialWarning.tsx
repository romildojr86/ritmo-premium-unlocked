
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Clock } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

interface ExpiredTrialWarningProps {
  userId: string;
  onStatusChange: () => void;
}

const ExpiredTrialWarning = ({ userId, onStatusChange }: ExpiredTrialWarningProps) => {
  const handleContinueWithFree = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          status: 'free',
          plano: 'gratuito'
        })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Você agora está no plano gratuito!');
      onStatusChange();
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
      toast.error('Erro ao atualizar plano. Tente novamente.');
    }
  };

  const handleMonthlyPlan = () => {
    // Link para Cakto mensal - substitua pela URL real
    window.open('#', '_blank');
  };

  const handleAnnualPlan = () => {
    // Link para Cakto anual - substitua pela URL real
    window.open('#', '_blank');
  };

  return (
    <Alert className="border-orange-200 bg-orange-50 mb-6">
      <Clock className="h-4 w-4 text-orange-600" />
      <AlertDescription className="space-y-4">
        <div>
          <p className="font-medium text-orange-800 mb-2">
            🕒 Seu acesso Premium gratuito terminou.
          </p>
          <p className="text-orange-700 text-sm">
            Aproveite todos os recursos sem limites. Escolha uma opção para continuar.
          </p>
        </div>

        <div className="space-y-3">
          {/* Opções de plano */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleMonthlyPlan}
              className="bg-green-500 hover:bg-green-600 text-white flex-1"
              size="sm"
            >
              Assinar Plano Mensal
            </Button>
            <Button 
              onClick={handleAnnualPlan}
              className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
              size="sm"
            >
              Assinar Plano Anual
            </Button>
          </div>

          {/* Botão discreto para continuar gratuito */}
          <div className="flex justify-center">
            <Button 
              onClick={handleContinueWithFree}
              variant="ghost"
              size="sm"
              className="text-orange-600 hover:text-orange-700 text-xs"
            >
              Quero continuar com o plano gratuito
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ExpiredTrialWarning;
