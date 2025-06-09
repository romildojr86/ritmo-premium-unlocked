
import React from 'react';
import GoalsForm from './GoalsForm';
import UserGoalsProgress from './UserGoalsProgress';

interface Stats {
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
}

interface GoalsSectionProps {
  stats: Stats;
}

const GoalsSection = ({ stats }: GoalsSectionProps) => {
  const handleGoalsSaved = () => {
    console.log('🎯 [GoalsSection] Metas salvas, atualizando componentes...');
    // Force refresh do UserGoalsProgress ao salvar metas
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <GoalsForm onGoalsSaved={handleGoalsSaved} />
      <UserGoalsProgress stats={stats} />
    </div>
  );
};

export default GoalsSection;
