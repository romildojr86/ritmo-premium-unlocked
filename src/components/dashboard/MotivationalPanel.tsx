
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

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
    // Buscar dados da semana atual usando SQL correto
    const { data, error } = await supabase
      .from('corridas')
      .select('data, distancia_km')
      .eq('user_id', userId)
      .gte('data', new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).toISOString().split('T')[0])
      .lt('data', new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 7)).toISOString().split('T')[0]);

    if (error) {
      console.error('Erro ao buscar dados semanais:', error);
      return;
    }

    // Inicializar dados da semana (Segunda a Domingo)
    const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const weeklyMap = new Map(weekDays.map(day => [day, 0]));

    // Processar dados das corridas
    data?.forEach(run => {
      const runDate = new Date(run.data);
      const dayOfWeek = runDate.getDay(); // 0 = domingo, 1 = segunda, etc
      
      // Mapear dias da semana corretamente
      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const dayName = dayNames[dayOfWeek];
      
      if (weeklyMap.has(dayName)) {
        weeklyMap.set(dayName, weeklyMap.get(dayName)! + Number(run.distancia_km));
      }
    });

    // Criar dados do gráfico na ordem Segunda a Domingo
    const chartData = weekDays.map(day => ({
      day,
      km: weeklyMap.get(day) || 0
    }));

    setWeeklyData(chartData);
  };

  const fetchStats = async (userId: string) => {
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
    
    // Início da semana (domingo)
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
  };

  const fetchGoals = async (userId: string) => {
    const { data, error } = await supabase
      .from('metas')
      .select('meta_semanal')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar metas:', error);
      return;
    }

    if (data) {
      setGoals(data);
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

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="text-center">Carregando...</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

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
