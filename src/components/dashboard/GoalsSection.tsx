
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

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

interface GoalsSectionProps {
  stats: Stats;
}

const GoalsSection = ({ stats }: GoalsSectionProps) => {
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
      toast.success('Metas salvas com sucesso!');
    } catch (error) {
      console.error('💥 Erro ao salvar metas:', error);
      setError('Erro ao salvar metas. Tente novamente.');
      toast.error('Erro ao salvar metas');
    } finally {
      setSaving(false);
    }
  };

  const calculateProgress = (current: number, goal: number) => {
    if (goal === 0) return 0;
    return Math.min((current / goal) * 100, 100);
  };

  const getProgressMessage = (current: number, goal: number, period: string) => {
    if (goal === 0) return `Defina sua meta ${period} para acompanhar o progresso!`;
    
    const remaining = goal - current;
    if (remaining <= 0) {
      return `🎉 Parabéns! Você bateu sua meta ${period}!`;
    }
    return `Você está a ${remaining.toFixed(1)}km de bater sua meta ${period}! 🏃‍♂️`;
  };

  const handleRetry = () => {
    console.log('🔄 Tentando recarregar metas...');
    fetchGoals();
  };

  return (
    <div className="space-y-6">
      {/* Formulário de Metas */}
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

      {/* Progresso das Metas */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Meta Semanal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Meta Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>{stats.thisWeek.toFixed(1)} / {goals.meta_semanal.toFixed(1)} km</span>
              </div>
              <Progress 
                value={calculateProgress(stats.thisWeek, goals.meta_semanal)} 
                className="h-2"
              />
              <p className="text-sm text-green-600 font-medium">
                {getProgressMessage(stats.thisWeek, goals.meta_semanal, 'semanal')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Meta Mensal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Meta Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>{stats.thisMonth.toFixed(1)} / {goals.meta_mensal.toFixed(1)} km</span>
              </div>
              <Progress 
                value={calculateProgress(stats.thisMonth, goals.meta_mensal)} 
                className="h-2"
              />
              <p className="text-sm text-green-600 font-medium">
                {getProgressMessage(stats.thisMonth, goals.meta_mensal, 'mensal')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Meta Anual */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Meta Anual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>{stats.thisYear.toFixed(1)} / {goals.meta_anual.toFixed(1)} km</span>
              </div>
              <Progress 
                value={calculateProgress(stats.thisYear, goals.meta_anual)} 
                className="h-2"
              />
              <p className="text-sm text-green-600 font-medium">
                {getProgressMessage(stats.thisYear, goals.meta_anual, 'anual')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoalsSection;
