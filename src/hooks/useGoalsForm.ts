
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

interface Goals {
  meta_semanal: number;
  meta_mensal: number;
  meta_anual: number;
}

export const useGoalsForm = (onGoalsSaved?: (goals: Goals) => void) => {
  const [metaSemanal, setMetaSemanal] = useState<number>(0);
  const [metaMensal, setMetaMensal] = useState<number>(0);
  const [metaAnual, setMetaAnual] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchGoals = async () => {
    try {
      console.log('🚀 [useGoalsForm] INICIANDO fetchGoals...');
      setLoading(true);
      
      console.log('🔐 [useGoalsForm] Verificando sessão...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ [useGoalsForm] Erro ao obter sessão:', sessionError);
        toast.error('Erro de autenticação');
        setLoading(false);
        return;
      }
      
      console.log('🔍 [useGoalsForm] Resultado da sessão:', { 
        hasSession: !!session, 
        userId: session?.user?.id,
        email: session?.user?.email 
      });
      
      if (!session?.user) {
        console.log('⚠️ [useGoalsForm] Usuário não autenticado - finalizando loading');
        setLoading(false);
        return;
      }

      console.log('📊 [useGoalsForm] Buscando metas para usuário:', session.user.id);

      const { data, error } = await supabase
        .from('metas')
        .select('*')
        .eq('user_id', session.user.id)
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
        setLoading(false);
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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      console.log('💾 [useGoalsForm] Verificando sessão para salvar:', { 
        hasSession: !!session, 
        userId: session?.user?.id 
      });
      
      if (!session?.user) {
        console.error('❌ [useGoalsForm] Usuário não autenticado ao salvar metas');
        toast.error('❌ Erro: usuário não autenticado');
        return;
      }

      const goalRecord = {
        user_id: session.user.id,
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
    console.log('🔄 [useGoalsForm] useEffect executado - iniciando carregamento...');
    fetchGoals();
  }, []);

  console.log('🎯 [useGoalsForm] Estado atual:', { 
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
