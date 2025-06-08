
import React from 'react';
import GoalsForm from './GoalsForm';
import GoalsProgressGrid from './GoalsProgressGrid';
import { useGoals } from '@/hooks/useGoals';

interface Stats {
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
}

interface GoalsSectionProps {
  stats: Stats;
}

const GoalsSection = ({ stats }: GoalsSectionProps) => {
  const { goals, setGoals } = useGoals();

  const handleGoalsSaved = (savedGoals: any) => {
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
