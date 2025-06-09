
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
  const { user, loading: authLoading } = useAuth();
  const [goals, setGoals] = useState<Goals | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    if (authLoading || !user?.id) return;
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
  }, [user?.id, authLoading]);

  useEffect(() => {
    if (!authLoading && user?.id) {
      fetchGoals();
    }
  }, [fetchGoals, authLoading, user?.id]);

  if (authLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">📈 Progresso das Metas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user?.id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">📈 Progresso das Metas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-gray-600">Aguardando autenticação...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">📈 Progresso das Metas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando metas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">📈 Progresso das Metas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchGoals} className="mt-4">
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!goals) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">📈 Progresso das Metas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-gray-600">Nenhuma meta definida ainda.</p>
            <p className="text-sm text-gray-500 mt-2">
              Configure suas metas no formulário acima para acompanhar seu progresso.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const weekProgress = goals.meta_semanal > 0 ? Math.min((stats.thisWeek / goals.meta_semanal) * 100, 100) : 0;
  const monthProgress = goals.meta_mensal > 0 ? Math.min((stats.thisMonth / goals.meta_mensal) * 100, 100) : 0;
  const yearProgress = goals.meta_anual > 0 ? Math.min((stats.thisYear / goals.meta_anual) * 100, 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-green-600">📈 Progresso das Metas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Meta Semanal */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Meta Semanal</span>
              <span className="text-sm text-gray-600">
                {stats.thisWeek.toFixed(1)} / {goals.meta_semanal} km
              </span>
            </div>
            <Progress value={weekProgress} className="h-3" />
            <p className="text-sm text-gray-500 mt-1">
              {weekProgress.toFixed(1)}% concluída
            </p>
          </div>

          {/* Meta Mensal */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Meta Mensal</span>
              <span className="text-sm text-gray-600">
                {stats.thisMonth.toFixed(1)} / {goals.meta_mensal} km
              </span>
            </div>
            <Progress value={monthProgress} className="h-3" />
            <p className="text-sm text-gray-500 mt-1">
              {monthProgress.toFixed(1)}% concluída
            </p>
          </div>

          {/* Meta Anual */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Meta Anual</span>
              <span className="text-sm text-gray-600">
                {stats.thisYear.toFixed(1)} / {goals.meta_anual} km
              </span>
            </div>
            <Progress value={yearProgress} className="h-3" />
            <p className="text-sm text-gray-500 mt-1">
              {yearProgress.toFixed(1)}% concluída
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserGoalsProgress;
