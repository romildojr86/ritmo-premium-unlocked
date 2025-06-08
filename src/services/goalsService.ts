
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

export interface Goals {
  meta_semanal: number;
  meta_mensal: number;
  meta_anual: number;
}

export const goalsService = {
  async fetchGoals(): Promise<{ data: Goals | null; error: string | null }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.log('⚠️ Usuário não autenticado ao carregar metas');
        return { data: null, error: null };
      }

      const { data, error } = await supabase
        .from('metas')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Erro ao buscar metas:', error);
        return { data: null, error: 'Erro ao carregar metas. Tente novamente.' };
      }

      if (data) {
        console.log('✅ Metas carregadas:', data);
        return { data, error: null };
      } else {
        console.log('📝 Nenhuma meta encontrada - usando valores padrão');
        return { data: null, error: null };
      }
    } catch (error) {
      console.error('💥 Erro fatal ao buscar metas:', error);
      return { data: null, error: 'Erro ao carregar metas. Tente novamente.' };
    }
  },

  async saveGoals(goalData: Goals, hasGoals: boolean): Promise<{ success: boolean; error: string | null }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.error('❌ Usuário não autenticado ao salvar metas');
        toast.error('❌ Erro ao salvar metas. Tente novamente.');
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Ensure all values are valid numbers
      const goalRecord = {
        user_id: session.user.id,
        meta_semanal: Number(goalData.meta_semanal) || 0,
        meta_mensal: Number(goalData.meta_mensal) || 0,
        meta_anual: Number(goalData.meta_anual) || 0
      };

      console.log('💾 Salvando metas:', goalRecord);

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

      if (error) {
        console.error('❌ Erro no Supabase ao salvar metas:', error);
        throw error;
      }

      console.log('✅ Metas salvas com sucesso no Supabase');
      toast.success('✅ Metas salvas com sucesso!');
      return { success: true, error: null };
    } catch (error) {
      console.error('💥 Erro ao salvar metas:', error);
      toast.error('❌ Erro ao salvar metas. Tente novamente.');
      return { success: false, error: 'Erro ao salvar metas. Tente novamente.' };
    }
  }
};
