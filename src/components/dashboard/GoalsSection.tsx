
import React, { useState } from 'react';
import GoalsForm from './GoalsForm';
import GoalsProgressGrid from './GoalsProgressGrid';

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

  const handleGoalsSaved = (savedGoals: Goals) => {
    setGoals(savedGoals);
  };

  return (
    <div className="space-y-6">
      <GoalsForm onGoalsSaved={handleGoalsSaved} />
      <GoalsProgressGrid goals={goals} stats={stats} />
    </div>
  );
};

export default GoalsSection;
