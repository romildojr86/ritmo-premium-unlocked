
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCards from './StatsCards';
import RunForm from './RunForm';
import GoalsSection from './GoalsSection';
import RunHistory from './RunHistory';
import UserGoalsProgress from './UserGoalsProgress';

interface Run {
  id: string;
  data: string;
  distancia_km: number;
  tempo_min: number;
  notas?: string;
  criado_em: string;
}

interface Stats {
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
  runsThisWeek: number;
}

interface PremiumUserDashboardProps {
  stats: Stats;
  runs: Run[];
  onRunAdded: () => void;
}

const PremiumUserDashboard = ({ stats, runs, onRunAdded }: PremiumUserDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Cards de estatísticas */}
      <StatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Registro de nova corrida */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Registrar Nova Corrida</CardTitle>
            <CardDescription>Registre sua corrida sem limites!</CardDescription>
          </CardHeader>
          <CardContent>
            <RunForm onRunAdded={onRunAdded} />
          </CardContent>
        </Card>

        {/* Metas do Usuário */}
        <UserGoalsProgress stats={stats} />
      </div>

      {/* Seção de Metas */}
      <GoalsSection stats={stats} />

      {/* Histórico de corridas */}
      <RunHistory runs={runs} />
    </div>
  );
};

export default PremiumUserDashboard;
