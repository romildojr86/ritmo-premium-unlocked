import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface Goals {
  meta_semanal: number;
  meta_mensal: number;
  meta_anual: number;
}

export const useGoalsForm = (onGoalsSaved?: (goals: Goals) => void) => {
  const { user } = useAuth();
  const [metaSemanal, setMetaSemanal] = useState<number>(0);
  const [metaMensal, setMetaMensal] = useState<number>(0);
  const [metaAnual, setMetaAnual] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchGoals = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('metas')
      .select('meta_semanal, meta_mensal, meta_anual')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      toast.error(`Erro ao carregar metas: ${error.message}`);
      setLoading(false);
      return;
    }

    if (data) {
      setMetaSemanal(data.meta_semanal || 0);
      setMetaMensal(data.meta_mensal || 0);
      setMetaAnual(data.meta_anual || 0);
    }

    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchGoals();
    }
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true);

    const { error } = await supabase
      .from('metas')
      .upsert({
        user_id: user.id,
        meta_semanal: metaSemanal,
        meta_mensal: metaMensal,
        meta_anual: metaAnual
      }, { onConflict: 'user_id' });

    if (error) {
      toast.error(`Erro ao salvar metas: ${error.message}`);
    } else {
      toast.success('Metas salvas com sucesso!');
      onGoalsSaved?.({
        meta_semanal: metaSemanal,
        meta_mensal: metaMensal,
        meta_anual: metaAnual
      });
    }

    setSaving(false);
  };

  return {
    metaSemanal,
    setMetaSemanal,
    metaMensal,
    setMetaMensal,
    metaAnual,
    setMetaAnual,
    loading,
    saving,
    handleSubmit
  };
};
