
import { useState } from 'react';

export interface Goals {
  meta_semanal: number;
  meta_mensal: number;
  meta_anual: number;
}

export const useGoals = () => {
  const [goals, setGoals] = useState<Goals>({
    meta_semanal: 0,
    meta_mensal: 0,
    meta_anual: 0
  });

  return {
    goals,
    setGoals
  };
};
