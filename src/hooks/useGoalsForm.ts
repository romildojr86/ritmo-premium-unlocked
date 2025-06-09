
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
    console.log('[useGoalsForm] user.id:', user?.id);
    
    // Só executa se tiver user.id
    if (!user?.id) {
      console.log('⚠️ [useGoalsForm] Aguardando user.id...');
      return;
    }

    try {
      console.log('🚀 [useGoalsForm] INICIANDO fetchGoals para user:', user.id);
      setLoading(true);

      console.log('📊 [useGoalsForm] Buscando metas para usuário:', user.id);

      const { data, error } = await supabase
        .from('metas')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('📊 [useGoalsForm] Resultado da query de metas:', { 
        data, 
        error: error?.message,
        errorCode: error?.code,
        hasData: !!data
      });

      if (error && error.code !== 'PGRST116') {
        console.error('❌ [useGoalsForm] Erro ao buscar metas:', error);
        toast.error(`Erro ao carregar metas: ${error.message}`);
        return;
      }

      if (data) {
        console.log('✅ [useGoalsForm] Metas carregadas:', {
          meta_semanal: data.meta_semanal,
          meta_mensal: data.meta_mensal,
          meta_anual: data.meta_anual
        });
        setMetaSemanal(data.meta_semanal || 0);
        setMetaMensal(data.meta_mensal || 0);
        setMetaAnual(data.meta_anual || 0);
      } else {
        console.log('📝 [useGoalsForm] Nenhuma meta encontrada - usando valores padrão');
        setMetaSemanal(0);
        setMetaMensal(0);
        setMetaAnual(0);
      }
    } catch (error) {
      console.error('💥 [useGoalsForm] Erro fatal ao buscar metas:', error);
      toast.error('Erro inesperado ao carregar metas. Tente novamente.');
    } finally {
      console.log('🏁 [useGoalsForm] FINALIZANDO fetchGoals - setLoading(false)');
      setLoading(false);
    }
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user?.id) {
      console.error('❌ [useGoalsForm] Usuário não autenticado ao salvar metas');
      toast.error('❌ Erro: usuário não autenticado');
      return;
    }
    
    try {
      setSaving(true);

      const goalRecord = {
        user_id: user.id,
        meta_semanal: metaSemanal,
        meta_mensal: metaMensal,
        meta_anual: metaAnual
      };

      console.log('💾 [useGoalsForm] Salvando metas:', goalRecord);

      const { error } = await supabase
        .from('metas')
        .upsert(goalRecord, {
          onConflict: 'user_id'
        });

      console.log('💾 [useGoalsForm] Resultado do upsert:', { error: error?.message });

      if (error) {
        console.error('❌ [useGoalsForm] Erro no Supabase ao salvar metas:', error);
        toast.error(`❌ Erro ao salvar metas: ${error.message}`);
        return;
      }

      console.log('✅ [useGoalsForm] Metas salvas com sucesso no Supabase');
      toast.success('✅ Metas salvas com sucesso!');
      
      onGoalsSaved?.({
        meta_semanal: metaSemanal,
        meta_mensal: metaMensal,
        meta_anual: metaAnual
      });

    } catch (error) {
      console.error('💥 [useGoalsForm] Erro ao salvar metas:', error);
      toast.error('❌ Erro inesperado ao salvar metas');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      console.log('🔄 [useGoalsForm] useEffect executado - iniciando carregamento para user:', user.id);
      fetchGoals();
    }
  }, [fetchGoals]);

  console.log('🎯 [useGoalsForm] Estado atual:', { 
    userId: user?.id,
    loading, 
    saving, 
    metaSemanal, 
    metaMensal, 
    metaAnual 
  });

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
