
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

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

export const useRuns = (user: User | null) => {
  const [runs, setRuns] = useState<Run[]>([]);
  const [stats, setStats] = useState<WeeklyStats>({
    thisWeek: 0,
    thisMonth: 0,
    thisYear: 0,
    runsThisWeek: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRuns(user.id);
    }
  }, [user]);

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

  const refetchRuns = () => {
    if (user) {
      fetchRuns(user.id);
    }
  };

  return { runs, stats, loading, refetchRuns };
};
