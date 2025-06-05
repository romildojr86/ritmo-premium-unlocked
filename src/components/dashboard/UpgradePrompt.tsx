
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const UpgradePrompt = () => {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="text-green-800">
          🚀 Desbloqueie o Potencial Completo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-green-700">
            Para acessar seu histórico completo, gráficos detalhados e definir metas personalizadas, 
            desbloqueie o Premium.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Com Premium você terá:</h4>
              <ul className="space-y-1 text-green-700">
                <li>✅ Corridas ilimitadas</li>
                <li>✅ Histórico completo</li>
                <li>✅ Gráficos de evolução</li>
                <li>✅ Metas personalizadas</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Plano atual (Gratuito):</h4>
              <ul className="space-y-1 text-green-700">
                <li>📊 Até 3 corridas por semana</li>
                <li>📊 Total semanal básico</li>
                <li>📊 Funcionalidades limitadas</li>
              </ul>
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button className="bg-green-600 hover:bg-green-700 flex-1">
              Desbloquear Premium
            </Button>
            <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
              Saiba Mais
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpgradePrompt;
