
import { useState } from 'react';

export interface Goals {
  meta_semanal: number;
  meta_mensal: number;
  meta_anual: number;
}

const defaultGoals: Goals = {
  meta_semanal: 0,
  meta_mensal: 0,
  meta_anual: 0
};

export const useGoalsState = () => {
  const [goals, setGoals] = useState<Goals>(defaultGoals);
  const [formData, setFormData] = useState<Goals>(defaultGoals);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasGoals, setHasGoals] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
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
  };
};
