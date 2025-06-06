
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

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

interface UserGoalsProgressProps {
  stats: Stats;
}

const UserGoalsProgress = ({ stats }: UserGoalsProgressProps) => {
  const [goals, setGoals] = useState<Goals | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('metas')
        .select('meta_semanal, meta_mensal, meta_anual')
        .eq('user_id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar metas:', error);
        return;
      }

      if (data) {
        setGoals(data);
      }
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando metas...</div>
        </CardContent>
      </Card>
    );
  }

  if (!goals) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">🎯 Metas do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Defina suas metas para acompanhar seu progresso!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-green-600">🎯 Metas do Usuário</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Meta Semanal */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Meta Semanal</h4>
              <span className="text-sm text-gray-600">
                {stats.thisWeek.toFixed(1)} / {goals.meta_semanal.toFixed(1)} km
              </span>
            </div>
            <Progress 
              value={calculateProgress(stats.thisWeek, goals.meta_semanal)} 
              className="h-3"
            />
            <p className="text-sm text-green-600 font-medium">
              {getProgressMessage(stats.thisWeek, goals.meta_semanal, 'semanal')}
            </p>
          </div>

          {/* Meta Mensal */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Meta Mensal</h4>
              <span className="text-sm text-gray-600">
                {stats.thisMonth.toFixed(1)} / {goals.meta_mensal.toFixed(1)} km
              </span>
            </div>
            <Progress 
              value={calculateProgress(stats.thisMonth, goals.meta_mensal)} 
              className="h-3"
            />
            <p className="text-sm text-green-600 font-medium">
              {getProgressMessage(stats.thisMonth, goals.meta_mensal, 'mensal')}
            </p>
          </div>

          {/* Meta Anual */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Meta Anual</h4>
              <span className="text-sm text-gray-600">
                {stats.thisYear.toFixed(1)} / {goals.meta_anual.toFixed(1)} km
              </span>
            </div>
            <Progress 
              value={calculateProgress(stats.thisYear, goals.meta_anual)} 
              className="h-3"
            />
            <p className="text-sm text-green-600 font-medium">
              {getProgressMessage(stats.thisYear, goals.meta_anual, 'anual')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserGoalsProgress;
