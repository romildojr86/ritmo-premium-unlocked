
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

export interface Goals {
  meta_semanal: number;
  meta_mensal: number;
  meta_anual: number;
}

export const useGoals = (onGoalsSaved?: (goals: Goals) => void) => {
  const [goals, setGoals] = useState<Goals>({
    meta_semanal: 0,
    meta_mensal: 0,
    meta_anual: 0
  });
  const [formData, setFormData] = useState<Goals>({
    meta_semanal: 0,
    meta_mensal: 0,
    meta_anual: 0
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasGoals, setHasGoals] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.log('⚠️ Usuário não autenticado ao carregar metas');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('metas')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Erro ao buscar metas:', error);
        setError('Erro ao carregar metas. Tente novamente.');
        return;
      }

      if (data) {
        setGoals(data);
        setFormData(data);
        setHasGoals(true);
        console.log('✅ Metas carregadas:', data);
      } else {
        console.log('📝 Nenhuma meta encontrada - usando valores padrão');
      }
    } catch (error) {
      console.error('💥 Erro fatal ao buscar metas:', error);
      setError('Erro ao carregar metas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const saveGoals = async (goalData: Goals) => {
    setSaving(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Usuário não autenticado');
        return;
      }

      const goalRecord = {
        user_id: session.user.id,
        meta_semanal: Number(goalData.meta_semanal),
        meta_mensal: Number(goalData.meta_mensal),
        meta_anual: Number(goalData.meta_anual)
      };

      let error;
      if (hasGoals) {
        const { error: updateError } = await supabase
          .from('metas')
          .update(goalRecord)
          .eq('user_id', session.user.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('metas')
          .insert(goalRecord);
        error = insertError;
      }

      if (error) throw error;

      setGoals(goalData);
      setHasGoals(true);
      onGoalsSaved?.(goalData);
      toast.success('Metas salvas com sucesso!');
    } catch (error) {
      console.error('💥 Erro ao salvar metas:', error);
      setError('Erro ao salvar metas. Tente novamente.');
      toast.error('Erro ao salvar metas');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return {
    goals,
    formData,
    setFormData,
    loading,
    saving,
    error,
    fetchGoals,
    saveGoals
  };
};
