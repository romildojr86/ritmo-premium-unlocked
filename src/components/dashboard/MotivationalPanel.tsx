
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";

interface WeeklyData {
  day: string;
  km: number;
}

interface Stats {
  thisWeek: number;
  thisYear: number;
}

interface Goals {
  meta_semanal: number;
}

const MotivationalPanel = () => {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [stats, setStats] = useState<Stats>({ thisWeek: 0, thisYear: 0 });
  const [goals, setGoals] = useState<Goals | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Inicializar com dados vazios para renderização imediata
    initializeEmptyData();
    fetchData();
  }, []);

  const initializeEmptyData = () => {
    const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const emptyWeeklyData = weekDays.map(day => ({ day, km: 0 }));
    setWeeklyData(emptyWeeklyData);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      // Executar todas as buscas em paralelo
      await Promise.all([
        fetchWeeklyData(session.user.id),
        fetchStats(session.user.id),
        fetchGoals(session.user.id)
      ]);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyData = async (userId: string) => {
    try {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);

      const { data, error } = await supabase
        .from('corridas')
        .select('data, distancia_km')
        .eq('user_id', userId)
        .gte('data', startOfWeek.toISOString().split('T')[0])
        .lt('data', endOfWeek.toISOString().split('T')[0]);

      if (error) {
        console.error('Erro ao buscar dados semanais:', error);
        return;
      }

      // Inicializar dados da semana
      const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
      const weeklyMap = new Map(weekDays.map(day => [day, 0]));

      // Processar dados das corridas
      data?.forEach(run => {
        const runDate = new Date(run.data);
        const dayOfWeek = runDate.getDay();
        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const dayName = dayNames[dayOfWeek];
        
        if (weeklyMap.has(dayName)) {
          weeklyMap.set(dayName, weeklyMap.get(dayName)! + Number(run.distancia_km));
        }
      });

      const chartData = weekDays.map(day => ({
        day,
        km: weeklyMap.get(day) || 0
      }));

      setWeeklyData(chartData);
    } catch (error) {
      console.error('Erro ao buscar dados semanais:', error);
    }
  };

  const fetchStats = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('corridas')
        .select('data, distancia_km')
        .eq('user_id', userId);

      if (error) {
        console.error('Erro ao buscar estatísticas:', error);
        return;
      }

      const now = new Date();
      const currentYear = now.getFullYear();
      
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const thisWeek = data
        ?.filter(run => new Date(run.data) >= startOfWeek)
        ?.reduce((sum, run) => sum + Number(run.distancia_km), 0) || 0;

      const thisYear = data
        ?.filter(run => new Date(run.data).getFullYear() === currentYear)
        ?.reduce((sum, run) => sum + Number(run.distancia_km), 0) || 0;

      setStats({ thisWeek, thisYear });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const fetchGoals = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('metas')
        .select('meta_semanal')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar metas:', error);
        return;
      }

      if (data) {
        setGoals(data);
      }
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
    }
  };

  const getMotivationalMessage = () => {
    if (stats.thisYear === 0) {
      return "Comece sua jornada de corrida hoje! 🏃‍♂️";
    }
    return `Você já correu ${stats.thisYear.toFixed(1)}km este ano, continue assim! 🎉`;
  };

  const getWeeklyGoalMessage = () => {
    if (!goals || goals.meta_semanal === 0) {
      return "Defina sua meta semanal para acompanhar seu progresso! 🎯";
    }

    const remaining = goals.meta_semanal - stats.thisWeek;
    if (remaining <= 0) {
      return "🎉 Parabéns! Você bateu sua meta semanal!";
    }
    return `Faltam ${remaining.toFixed(1)}km para você bater sua meta semanal! 🏃`;
  };

  const chartConfig = {
    km: {
      label: "Quilômetros",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Gráfico de evolução semanal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600 flex items-center gap-2">
            📈 Evolução Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                />
                <YAxis hide />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`${value} km`, 'Distância']}
                />
                <Bar 
                  dataKey="km" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Resumo do desempenho */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600 flex items-center gap-2">
            🏅 Desempenho Anual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-3xl font-bold text-green-600">
              {stats.thisYear.toFixed(1)} km
            </div>
            <p className="text-sm text-green-600 font-medium">
              {getMotivationalMessage()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Meta em andamento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600 flex items-center gap-2">
            🎯 Meta Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-2xl font-bold text-green-600">
              {stats.thisWeek.toFixed(1)} km
            </div>
            {goals && goals.meta_semanal > 0 && (
              <div className="text-sm text-gray-600">
                de {goals.meta_semanal.toFixed(1)} km
              </div>
            )}
            <p className="text-sm text-green-600 font-medium">
              {getWeeklyGoalMessage()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotivationalPanel;
