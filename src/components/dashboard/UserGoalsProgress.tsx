
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 [UserGoalsProgress] Componente montado, iniciando carregamento...');
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔍 [UserGoalsProgress] Verificando sessão:', { 
        hasSession: !!session, 
        userId: session?.user?.id,
        email: session?.user?.email 
      });
      
      if (!session?.user) {
        console.log('⚠️ [UserGoalsProgress] Usuário não autenticado ao carregar metas do progresso');
        setLoading(false);
        return;
      }

      console.log('📊 [UserGoalsProgress] Buscando metas para usuário:', session.user.id);

      const { data, error } = await supabase
        .from('metas')
        .select('meta_semanal, meta_mensal, meta_anual')
        .eq('user_id', session.user.id)
        .maybeSingle();

      console.log('📊 [UserGoalsProgress] Resultado da query:', { 
        data, 
        error: error?.message,
        errorCode: error?.code,
        errorDetails: error?.details 
      });

      if (error && error.code !== 'PGRST116') {
        console.error('❌ [UserGoalsProgress] Erro ao buscar metas do progresso:', error);
        setError(`Erro ao carregar metas: ${error.message}`);
        return;
      }

      if (data) {
        setGoals(data);
        console.log('✅ [UserGoalsProgress] Metas do progresso carregadas com sucesso:', data);
      } else {
        console.log('📝 [UserGoalsProgress] Nenhuma meta encontrada para o progresso');
        setGoals(null);
      }
    } catch (error) {
      console.error('💥 [UserGoalsProgress] Erro fatal ao buscar metas do progresso:', error);
      setError('Erro inesperado ao carregar metas. Tente novamente.');
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

  const handleRetry = () => {
    console.log('🔄 [UserGoalsProgress] Usuário solicitou retry das metas...');
    fetchGoals();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">🎯 Metas do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Carregando metas...</div>
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
            <Button 
              onClick={handleRetry}
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Tentar novamente
            </Button>
          </div>
        )}

        {!goals && !loading && !error ? (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-2">Defina suas metas para acompanhar seu progresso!</p>
            <p className="text-sm text-gray-500">Use o formulário "Minhas Metas" abaixo para começar.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Meta Semanal */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Meta Semanal</h4>
                <span className="text-sm text-gray-600">
                  {stats.thisWeek.toFixed(1)} / {(goals?.meta_semanal || 0).toFixed(1)} km
                </span>
              </div>
              <Progress 
                value={calculateProgress(stats.thisWeek, goals?.meta_semanal || 0)} 
                className="h-3"
              />
              <p className="text-sm text-green-600 font-medium">
                {getProgressMessage(stats.thisWeek, goals?.meta_semanal || 0, 'semanal')}
              </p>
            </div>

            {/* Meta Mensal */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Meta Mensal</h4>
                <span className="text-sm text-gray-600">
                  {stats.thisMonth.toFixed(1)} / {(goals?.meta_mensal || 0).toFixed(1)} km
                </span>
              </div>
              <Progress 
                value={calculateProgress(stats.thisMonth, goals?.meta_mensal || 0)} 
                className="h-3"
              />
              <p className="text-sm text-green-600 font-medium">
                {getProgressMessage(stats.thisMonth, goals?.meta_mensal || 0, 'mensal')}
              </p>
            </div>

            {/* Meta Anual */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Meta Anual</h4>
                <span className="text-sm text-gray-600">
                  {stats.thisYear.toFixed(1)} / {(goals?.meta_anual || 0).toFixed(1)} km
                </span>
              </div>
              <Progress 
                value={calculateProgress(stats.thisYear, goals?.meta_anual || 0)} 
                className="h-3"
              />
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
