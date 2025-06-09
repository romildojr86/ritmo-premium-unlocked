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
  const { user, loading: authLoading } = useAuth(); // Obter o estado de carregamento da autenticação
  const [goals, setGoals] = useState<Goals | null>(null);
  const [loading, setLoading] = useState(false); // Estado de carregamento das metas
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    if (authLoading || !user?.id) return; // Só buscar se a autenticação não estiver carregando e o user.id estiver presente
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
  }, [user?.id, authLoading]); // Adicionar authLoading às dependências

  useEffect(() => {
    if (!authLoading && user?.id) { // Só chamar fetchGoals se a autenticação não estiver carregando e o user.id estiver disponível
      fetchGoals();
    }
  }, [fetchGoals, authLoading, user?.id]); // Adicionar authLoading e user?.id às dependências

  if (authLoading) { // Exibir 
