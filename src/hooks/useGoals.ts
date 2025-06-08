
import { useEffect } from 'react';
import { goalsService } from '@/services/goalsService';
import { useGoalsState } from './useGoalsState';
import type { Goals } from '@/services/goalsService';

export type { Goals } from '@/services/goalsService';

export const useGoals = (onGoalsSaved?: (goals: Goals) => void) => {
  const {
    goals,
    setGoals,
    formData,
    setFormData,
    loading,
    setLoading,
    saving,
    setSaving,
    hasGoals,
    setHasGoals,
    error,
    setError
  } = useGoalsState();

  const fetchGoals = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error: fetchError } = await goalsService.fetchGoals();
    
    if (fetchError) {
      setError(fetchError);
    } else if (data) {
      setGoals(data);
      setFormData(data);
      setHasGoals(true);
    }
    
    setLoading(false);
  };

  const saveGoals = async (goalData: Goals) => {
    console.log('🎯 Iniciando salvamento de metas:', goalData);
    setSaving(true);
    setError(null);

    const { success, error: saveError } = await goalsService.saveGoals(goalData, hasGoals);

    if (success) {
      console.log('✅ Metas salvas com sucesso');
      setGoals(goalData);
      setHasGoals(true);
      onGoalsSaved?.(goalData);
    } else if (saveError) {
      console.error('❌ Erro ao salvar metas:', saveError);
      setError(saveError);
    }

    setSaving(false);
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
