
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

interface Goals {
  meta_semanal: number;
  meta_mensal: number;
  meta_anual: number;
}

interface GoalsFormFieldsProps {
  onGoalsSaved?: (goals: Goals) => void;
}

const GoalsFormFields = ({ onGoalsSaved }: GoalsFormFieldsProps) => {
  const [metaSemanal, setMetaSemanal] = useState<number>(0);
  const [metaMensal, setMetaMensal] = useState<number>(0);
  const [metaAnual, setMetaAnual] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasGoals, setHasGoals] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.log('⚠️ Usuário não autenticado ao carregar metas');
        return;
      }

      const { data, error } = await supabase
        .from('metas')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Erro ao buscar metas:', error);
        toast.error('❌ Erro ao carregar metas');
        return;
      }

      if (data) {
        console.log('✅ Metas carregadas:', data);
        setMetaSemanal(data.meta_semanal || 0);
        setMetaMensal(data.meta_mensal || 0);
        setMetaAnual(data.meta_anual || 0);
        setHasGoals(true);
      } else {
        console.log('📝 Nenhuma meta encontrada - usando valores padrão');
        setHasGoals(false);
      }
    } catch (error) {
      console.error('💥 Erro fatal ao buscar metas:', error);
      toast.error('❌ Erro ao carregar metas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.error('❌ Usuário não autenticado ao salvar metas');
        toast.error('❌ Erro ao salvar metas');
        return;
      }

      const goalRecord = {
        user_id: session.user.id,
        meta_semanal: metaSemanal,
        meta_mensal: metaMensal,
        meta_anual: metaAnual
      };

      console.log('💾 Fazendo upsert das metas:', goalRecord);

      // Usar upsert para inserir ou atualizar
      const { error } = await supabase
        .from('metas')
        .upsert(goalRecord, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('❌ Erro no Supabase ao salvar metas:', error);
        toast.error('❌ Erro ao salvar metas');
        return;
      }

      console.log('✅ Metas salvas com sucesso no Supabase');
      toast.success('✅ Metas salvas com sucesso!');
      setHasGoals(true);
      
      // Chama callback se fornecido
      onGoalsSaved?.({
        meta_semanal: metaSemanal,
        meta_mensal: metaMensal,
        meta_anual: metaAnual
      });

    } catch (error) {
      console.error('💥 Erro ao salvar metas:', error);
      toast.error('❌ Erro ao salvar metas');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Goals, value: string) => {
    const numericValue = parseFloat(value) || 0;
    
    switch (field) {
      case 'meta_semanal':
        setMetaSemanal(numericValue);
        break;
      case 'meta_mensal':
        setMetaMensal(numericValue);
        break;
      case 'meta_anual':
        setMetaAnual(numericValue);
        break;
    }
  };

  if (loading) {
    return <div className="text-center py-4">Carregando metas...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="meta_semanal">Meta Semanal (km)</Label>
          <Input
            id="meta_semanal"
            name="meta_semanal"
            type="number"
            step="any"
            min="0"
            required
            placeholder="15.0"
            value={metaSemanal}
            onChange={(e) => handleInputChange('meta_semanal', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="meta_mensal">Meta Mensal (km)</Label>
          <Input
            id="meta_mensal"
            name="meta_mensal"
            type="number"
            step="any"
            min="0"
            required
            placeholder="60.0"
            value={metaMensal}
            onChange={(e) => handleInputChange('meta_mensal', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="meta_anual">Meta Anual (km)</Label>
          <Input
            id="meta_anual"
            name="meta_anual"
            type="number"
            step="any"
            min="0"
            required
            placeholder="720.0"
            value={metaAnual}
            onChange={(e) => handleInputChange('meta_anual', e.target.value)}
          />
        </div>
      </div>
      <Button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={saving}
      >
        {saving ? 'Salvando...' : 'Salvar Metas'}
      </Button>
    </form>
  );
};

export default GoalsFormFields;
