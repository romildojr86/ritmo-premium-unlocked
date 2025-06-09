
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

  console.log('🎯 [GoalsFormFields] Renderizando com loading:', loading);

  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">Carregando metas...</p>
        <p className="text-sm text-gray-500 mt-2">Se esta mensagem persistir por mais de 5 segundos, verifique o console (F12) para logs de debug</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    );
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
