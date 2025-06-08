
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-green-600">🎯 Minhas Metas</CardTitle>
      </CardHeader>
      <CardContent>
        <GoalsFormFields onGoalsSaved={onGoalsSaved} />
      </CardContent>
    </Card>
  );
};

export default GoalsForm;
