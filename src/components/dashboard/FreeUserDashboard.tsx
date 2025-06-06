
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RunForm from './RunForm';
import UpgradePrompt from './UpgradePrompt';

interface FreeUserDashboardProps {
  stats: {
    thisWeek: number;
    runsThisWeek: number;
  };
  onRunAdded: () => void;
}

const FreeUserDashboard = ({ stats, onRunAdded }: FreeUserDashboardProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Registro de corrida para usuários gratuitos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Registrar Nova Corrida</CardTitle>
          <CardDescription>
            {stats.runsThisWeek >= 3 
              ? 'Você atingiu o limite de 3 corridas por semana no plano gratuito.'
              : `Registre sua corrida (${stats.runsThisWeek}/3 esta semana)`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.runsThisWeek < 3 ? (
            <RunForm onRunAdded={onRunAdded} />
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">Limite semanal atingido</p>
              <Button className="bg-green-600 hover:bg-green-700">
                Desbloquear Premium
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Total da semana simples */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso da Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.thisWeek.toFixed(1)} km
            </div>
            <p className="text-gray-600">Total percorrido esta semana</p>
          </div>
        </CardContent>
      </Card>

      {/* Prompt de upgrade */}
      <div className="md:col-span-2">
        <UpgradePrompt />
      </div>
    </div>
  );
};

export default FreeUserDashboard;
