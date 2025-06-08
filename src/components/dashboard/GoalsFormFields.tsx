
import React from 'react';
import { useGoalsForm } from '@/hooks/useGoalsForm';
import GoalsInputFields from './GoalsInputFields';
import GoalsSubmitButton from './GoalsSubmitButton';

interface Goals {
  meta_semanal: number;
  meta_mensal: number;
  meta_anual: number;
}

interface GoalsFormFieldsProps {
  onGoalsSaved?: (goals: Goals) => void;
}

const GoalsFormFields = ({ onGoalsSaved }: GoalsFormFieldsProps) => {
  const {
    metaSemanal,
    setMetaSemanal,
    metaMensal,
    setMetaMensal,
    metaAnual,
    setMetaAnual,
    loading,
    saving,
    handleSubmit
  } = useGoalsForm(onGoalsSaved);

  if (loading) {
    return <div className="text-center py-4">Carregando metas...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <GoalsInputFields
        metaSemanal={metaSemanal}
        setMetaSemanal={setMetaSemanal}
        metaMensal={metaMensal}
        setMetaMensal={setMetaMensal}
        metaAnual={metaAnual}
        setMetaAnual={setMetaAnual}
      />
      <GoalsSubmitButton saving={saving} />
    </form>
  );
};

export default GoalsFormFields;
