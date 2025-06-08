
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGoals } from '@/hooks/useGoals';
import GoalsErrorDisplay from './GoalsErrorDisplay';
import GoalsFormFields from './GoalsFormFields';

interface Goals {
  meta_semanal: number;
  meta_mensal: number;
  meta_anual: number;
}

interface GoalsFormProps {
  onGoalsSaved: (goals: Goals) => void;
}

const GoalsForm = ({ onGoalsSaved }: GoalsFormProps) => {
  const {
    formData,
    setFormData,
    loading,
    saving,
    error,
    fetchGoals,
    saveGoals
  } = useGoals(onGoalsSaved);

  const handleSaveGoals = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveGoals(formData);
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
          <GoalsErrorDisplay error={error} onRetry={handleRetry} />
        )}
        
        <GoalsFormFields
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={handleSaveGoals}
          saving={saving}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
};

export default GoalsForm;
