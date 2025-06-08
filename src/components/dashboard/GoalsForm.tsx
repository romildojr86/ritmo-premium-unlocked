
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

interface Goals {
  meta_semanal: number;
  meta_mensal: number;
  meta_anual: number;
}

interface GoalsFormProps {
  onGoalsSaved: (goals: Goals) => void;
}

const GoalsForm = ({ onGoalsSaved }: GoalsFormProps) => {
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

  useEffect(() => {
    fetchGoals();
  }, []);

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
        // Manter valores zerados quando não há metas
      }
    } catch (error) {
      console.error('💥 Erro fatal ao buscar metas:', error);
      setError('Erro ao carregar metas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoals = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Usuário não autenticado');
        return;
      }

      const goalData = {
        user_id: session.user.id,
        meta_semanal: Number(formData.meta_semanal),
        meta_mensal: Number(formData.meta_mensal),
        meta_anual: Number(formData.meta_anual)
      };

      let error;
      if (hasGoals) {
        const { error: updateError } = await supabase
          .from('metas')
          .update(goalData)
          .eq('user_id', session.user.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('metas')
          .insert(goalData);
        error = insertError;
      }

      if (error) throw error;

      setGoals(formData);
      setHasGoals(true);
      onGoalsSaved(formData);
      toast.success('Metas salvas com sucesso!');
    } catch (error) {
      console.error('💥 Erro ao salvar metas:', error);
      setError('Erro ao salvar metas. Tente novamente.');
      toast.error('Erro ao salvar metas');
    } finally {
      setSaving(false);
    }
  };

  const handleRetry = () => {
    console.log('🔄 Tentando recarregar metas...');
    fetchGoals();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-green-600">🎯 Minhas Metas</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
            <Button 
              onClick={handleRetry}
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Tentar novamente
            </Button>
          </div>
        )}
        
        <form onSubmit={handleSaveGoals} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="meta_semanal">Meta Semanal (km)</Label>
              <Input
                id="meta_semanal"
                type="number"
                step="0.1"
                min="0"
                placeholder="15.0"
                value={formData.meta_semanal || ''}
                onChange={(e) => setFormData({ ...formData, meta_semanal: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="meta_mensal">Meta Mensal (km)</Label>
              <Input
                id="meta_mensal"
                type="number"
                step="0.1"
                min="0"
                placeholder="60.0"
                value={formData.meta_mensal || ''}
                onChange={(e) => setFormData({ ...formData, meta_mensal: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="meta_anual">Meta Anual (km)</Label>
              <Input
                id="meta_anual"
                type="number"
                step="0.1"
                min="0"
                placeholder="720.0"
                value={formData.meta_anual || ''}
                onChange={(e) => setFormData({ ...formData, meta_anual: Number(e.target.value) })}
                required
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={saving || loading}
          >
            {saving ? 'Salvando...' : 'Salvar Metas'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GoalsForm;
