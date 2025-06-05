
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  stats: {
    thisWeek: number;
    thisMonth: number;
    thisYear: number;
    runsThisWeek: number;
  };
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Km da Semana</CardTitle>
          <span className="text-green-600">🏃</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.thisWeek.toFixed(1)} km</div>
          <p className="text-xs text-muted-foreground">
            {stats.runsThisWeek} corridas esta semana
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Km do Mês</CardTitle>
          <span className="text-green-600">📅</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.thisMonth.toFixed(1)} km</div>
          <p className="text-xs text-muted-foreground">
            Meta mensal: 60km
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Km do Ano</CardTitle>
          <span className="text-green-600">🏆</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.thisYear.toFixed(1)} km</div>
          <p className="text-xs text-muted-foreground">
            Meta anual: 720km
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
