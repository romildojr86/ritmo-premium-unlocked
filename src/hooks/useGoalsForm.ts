import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export const useGoalsForm = (onGoalsSaved?: (goals: any) => void) => {
  const { user } = useAuth();

  const [metaSemanal, setMetaSemanal] = useState(0);
  const [metaMensal, setMetaMensal] = useState(0);
  const [metaAnual, setMetaAnual] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('metas')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        toast.error("Erro ao carregar metas");
      } else if (data) {
        setMetaSemanal(data.meta_semanal);
        setMetaMensal(data.meta_mensal);
        setMetaAnual(data.meta_anual);
      }

      setLoading(false);
    };

    fetchGoals();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setSaving(true);

    const { error } = await supabase.from('metas').upsert({
      user_id: user.id,
      meta_semanal: metaSemanal,
      meta_mensal: metaMensal,
      meta_anual: metaAnual
    }, { onConflict: 'user_id' });

    if (error) {
      toast.error("Erro ao salvar metas");
    } else {
      toast.success("Metas salvas!");
      onGoalsSaved?.({ meta_semanal: metaSemanal, meta_mensal: metaMensal, meta_anual: metaAnual });
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