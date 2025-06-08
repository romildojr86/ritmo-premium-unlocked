
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Goals {
  meta_semanal: number;
  meta_mensal: number;
  meta_anual: number;
}

interface Stats {
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
}

interface GoalsProgressGridProps {
  goals: Goals;
  stats: Stats;
}

const GoalsProgressGrid = ({ goals, stats }: GoalsProgressGridProps) => {
  const calculateProgress = (current: number, goal: number) => {
    if (goal === 0) return 0;
    return Math.min((current / goal) * 100, 100);
  };

  const getProgressMessage = (current: number, goal: number, period: string) => {
    if (goal === 0) return `Defina sua meta ${period} para acompanhar o progresso!`;
    
    const remaining = goal - current;
    if (remaining <= 0) {
      return `🎉 Parabéns! Você bateu sua meta ${period}!`;
    }
    return `Você está a ${remaining.toFixed(1)}km de bater sua meta ${period}! 🏃‍♂️`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Meta Semanal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Meta Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{stats.thisWeek.toFixed(1)} / {goals.meta_semanal.toFixed(1)} km</span>
            </div>
            <Progress 
              value={calculateProgress(stats.thisWeek, goals.meta_semanal)} 
              className="h-2"
            />
            <p className="text-sm text-green-600 font-medium">
              {getProgressMessage(stats.thisWeek, goals.meta_semanal, 'semanal')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Meta Mensal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Meta Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{stats.thisMonth.toFixed(1)} / {goals.meta_mensal.toFixed(1)} km</span>
            </div>
            <Progress 
              value={calculateProgress(stats.thisMonth, goals.meta_mensal)} 
              className="h-2"
            />
            <p className="text-sm text-green-600 font-medium">
              {getProgressMessage(stats.thisMonth, goals.meta_mensal, 'mensal')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Meta Anual */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Meta Anual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{stats.thisYear.toFixed(1)} / {goals.meta_anual.toFixed(1)} km</span>
            </div>
            <Progress 
              value={calculateProgress(stats.thisYear, goals.meta_anual)} 
              className="h-2"
            />
            <p className="text-sm text-green-600 font-medium">
              {getProgressMessage(stats.thisYear, goals.meta_anual, 'anual')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalsProgressGrid;
