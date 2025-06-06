
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCards from './StatsCards';
import RunForm from './RunForm';
import GoalsSection from './GoalsSection';
import RunHistory from './RunHistory';

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

        {/* Meta semanal */}
        <Card>
          <CardHeader>
            <CardTitle>Meta Semanal</CardTitle>
            <CardDescription>Progresso da sua meta de 15km por semana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>{stats.thisWeek.toFixed(1)} / 15.0 km</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((stats.thisWeek / 15) * 100, 100)}%` }}
                ></div>
              </div>
              {stats.thisWeek < 15 && (
                <p className="text-sm text-green-600 font-medium">
                  Você está a {(15 - stats.thisWeek).toFixed(1)}km de bater sua meta semanal! 🏃‍♂️
                </p>
              )}
              {stats.thisWeek >= 15 && (
                <p className="text-sm text-green-600 font-medium">
                  🎉 Parabéns! Você bateu sua meta semanal!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Metas */}
      <GoalsSection stats={stats} />

      {/* Histórico de corridas */}
      <RunHistory runs={runs} />
    </div>
  );
};

export default PremiumUserDashboard;
