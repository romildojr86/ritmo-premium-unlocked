
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface DashboardErrorProps {
  onRetry: () => void;
  error?: string;
}

const DashboardError = ({ onRetry, error }: DashboardErrorProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ❌ Ocorreu um erro ao carregar seu dashboard
          </h2>
          <p className="text-gray-600 mb-6">
            Não conseguimos carregar seus dados. 
            {error && (
              <span className="block mt-2 text-sm text-red-600">
                Erro: {error}
              </span>
            )}
          </p>
          <Button 
            onClick={onRetry}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Clique aqui para recarregar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardError;
