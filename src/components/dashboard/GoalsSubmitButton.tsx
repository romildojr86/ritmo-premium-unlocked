
import React from 'react';
import { Button } from "@/components/ui/button";

interface GoalsSubmitButtonProps {
  saving: boolean;
}

const GoalsSubmitButton = ({ saving }: GoalsSubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-green-600 hover:bg-green-700"
      disabled={saving}
    >
      {saving ? 'Salvando...' : 'Salvar Metas'}
    </Button>
  );
};

export default GoalsSubmitButton;
