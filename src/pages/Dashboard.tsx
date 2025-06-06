import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import StatsCards from '@/components/dashboard/StatsCards';
import RunForm from '@/components/dashboard/RunForm';
import RunHistory from '@/components/dashboard/RunHistory';
import UpgradePrompt from '@/components/dashboard/UpgradePrompt';
import GoalsSection from '@/components/dashboard/GoalsSection';

interface UserProfile {
  id: string;
  nome: string;
  email: string;
  status: string;
}

interface Run {
  id: string;
  data: string;
  distancia_km: number;
  tempo_min: number;
  notas?: string;
  criado_em: string;
}

interface WeeklyStats {
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
  runsThisWeek: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [stats, setStats] = useState<WeeklyStats>({
    thisWeek: 0,
    thisMonth: 0,
    thisYear: 0,
    runsThisWeek: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/auth');
        return;
      }
      
      setUser(session.user);
      await fetchUserProfile(session.user.id);
      await fetchRuns(session.user.id);
    };

    getUser();
  }, [navigate]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      toast.error('Erro ao carregar perfil do usuário');
    }
  };

  const fetchRuns = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('corridas')
        .select('*')
        .eq('user_id', userId)
        .order('data', { ascending: false });

      if (error) throw error;
      
      setRuns(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Erro ao buscar corridas:', error);
      toast.error('Erro ao carregar corridas');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (runsData: Run[]) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Início da semana (domingo)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const thisWeek = runsData
      .filter(run => new Date(run.data) >= startOfWeek)
      .reduce((sum, run) => sum + Number(run.distancia_km), 0);

    const thisMonth = runsData
      .filter(run => {
        const runDate = new Date(run.data);
        return runDate.getFullYear() === currentYear && runDate.getMonth() === currentMonth;
      })
      .reduce((sum, run) => sum + Number(run.distancia_km), 0);

    const thisYear = runsData
      .filter(run => new Date(run.data).getFullYear() === currentYear)
      .reduce((sum, run) => sum + Number(run.distancia_km), 0);

    const runsThisWeek = runsData
      .filter(run => new Date(run.data) >= startOfWeek).length;

    setStats({ thisWeek, thisMonth, thisYear, runsThisWeek });
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erro ao fazer logout');
    } else {
      toast.success('Logout realizado com sucesso!');
      navigate('/auth');
    }
  };

  const handleRunAdded = () => {
    if (user) {
      fetchRuns(user.id);
      toast.success('Corrida registrada com sucesso!');
    }
  };

  const isPremium = userProfile?.status === 'premium' || userProfile?.status === 'vitalicio';
  const isFree = userProfile?.status === 'free';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <WelcomeSection userName={userProfile?.nome || 'Usuário'} />
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="text-gray-600 hover:text-gray-800"
          >
            Sair
          </Button>
        </div>

        {/* Conteúdo baseado no status */}
        {isFree && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Registro de corrida para usuários gratuitos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Registrar Nova Corrida</CardTitle>
                <CardDescription>
                  {stats.runsThisWeek >= 3 
                    ? 'Você atingiu o limite de 3 corridas por semana no plano gratuito.'
                    : `Registre sua corrida (${stats.runsThisWeek}/3 esta semana)`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats.runsThisWeek < 3 ? (
                  <RunForm onRunAdded={handleRunAdded} />
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">Limite semanal atingido</p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      Desbloquear Premium
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Total da semana simples */}
            <Card>
              <CardHeader>
                <CardTitle>Progresso da Semana</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {stats.thisWeek.toFixed(1)} km
                  </div>
                  <p className="text-gray-600">Total percorrido esta semana</p>
                </div>
              </CardContent>
            </Card>

            {/* Prompt de upgrade */}
            <div className="md:col-span-2">
              <UpgradePrompt />
            </div>
          </div>
        )}

        {isPremium && (
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
                  <RunForm onRunAdded={handleRunAdded} />
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;
