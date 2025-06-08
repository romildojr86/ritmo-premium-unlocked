
import React from 'react';
import { Button } from "@/components/ui/button";

interface GoalsErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

const GoalsErrorDisplay = ({ error, onRetry }: GoalsErrorDisplayProps) => {
  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
      <p className="text-red-600 text-sm">{error}</p>
      <Button 
        onClick={onRetry}
        variant="outline" 
        size="sm" 
        className="mt-2"
      >
        Tentar novamente
      </Button>
    </div>
  );
};

export default GoalsErrorDisplay;
