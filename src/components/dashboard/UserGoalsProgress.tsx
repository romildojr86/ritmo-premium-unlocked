
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goals | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('metas')
      .select('meta_semanal, meta_mensal, meta_anual')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      setError(`Erro ao carregar metas: ${error.message}`);
      setLoading(false);
      return;
    }

    if (data) setGoals(data);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const calculateProgress = (current: number, goal: number) => {
    if (goal === 0) return 0;
    return Math.min((current / goal) * 100, 100);
  };

  const getProgressMessage = (current: number, goal: number, period: string) => {
    if (goal === 0) return `Defina sua meta ${period} para acompanhar o progresso!`;
    const remaining = goal - current;
    return remaining <= 0
      ? `🎉 Parabéns! Você bateu sua meta ${period}!`
      : `Você está a ${remaining.toFixed(1)}km de bater sua meta ${period}! 🏃‍♂️`;
  };

  const handleRetry = () => {
    fetchGoals();
  };

  if (!user?.id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">🎯 Metas do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 py-4">Carregando usuário...</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">🎯 Metas do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4">Carregando metas...</p>
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
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
            <Button onClick={handleRetry} variant="outline" size="sm" className="mt-2">
              Tentar novamente
            </Button>
          </div>
        )}

        {!goals && !error ? (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-2">Nenhuma meta cadastrada</p>
            <p className="text-sm text-gray-500">Use o formulário "Minhas Metas" acima para definir suas metas.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Meta Semanal</h4>
                <span className="text-sm text-gray-600">
                  {stats.thisWeek.toFixed(1)} / {(goals?.meta_semanal || 0).toFixed(1)} km
                </span>
              </div>
              <Progress value={calculateProgress(stats.thisWeek, goals?.meta_semanal || 0)} className="h-3" />
              <p className="text-sm text-green-600 font-medium">
                {getProgressMessage(stats.thisWeek, goals?.meta_semanal || 0, 'semanal')}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Meta Mensal</h4>
                <span className="text-sm text-gray-600">
                  {stats.thisMonth.toFixed(1)} / {(goals?.meta_mensal || 0).toFixed(1)} km
                </span>
              </div>
              <Progress value={calculateProgress(stats.thisMonth, goals?.meta_mensal || 0)} className="h-3" />
              <p className="text-sm text-green-600 font-medium">
                {getProgressMessage(stats.thisMonth, goals?.meta_mensal || 0, 'mensal')}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Meta Anual</h4>
                <span className="text-sm text-gray-600">
                  {stats.thisYear.toFixed(1)} / {(goals?.meta_anual || 0).toFixed(1)} km
                </span>
              </div>
              <Progress value={calculateProgress(stats.thisYear, goals?.meta_anual || 0)} className="h-3" />
              <p className="text-sm text-green-600 font-medium">
                {getProgressMessage(stats.thisYear, goals?.meta_anual || 0, 'anual')}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserGoalsProgress;
