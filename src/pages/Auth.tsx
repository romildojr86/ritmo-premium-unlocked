import React, { useState } from 'react';
import SignupForm from '@/components/auth/SignupForm';
import LoginForm from '@/components/auth/LoginForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

type AuthView = 'plans' | 'signup' | 'login' | 'forgot';

const Auth = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<AuthView>('plans');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'monthly' | 'lifetime'>('free');

  const handleForgotPassword = () => {
    setCurrentView('forgot');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
  };

  const handlePlanSelection = (plan: 'free' | 'monthly' | 'lifetime') => {
    setSelectedPlan(plan);
    setCurrentView('signup');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (currentView === 'plans') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Escolha seu plano
            </h1>
            <p className="text-gray-600">
              Comece grátis ou acelere sua evolução com os planos Premium
            </p>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="border-2 border-gray-200 hover:border-gray-300 transition-all duration-200">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Gratuito
                </CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  R$ 0
                  <span className="text-lg font-normal text-gray-600">/sempre</span>
                </div>
                <p className="text-gray-600">Para começar sua jornada</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Até 3 corridas por semana</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Visualização da semana atual</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-50">
                    <span className="w-5 h-5 flex-shrink-0 text-gray-400">❌</span>
                    <span className="text-gray-400">Sem metas ou gráficos</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => handlePlanSelection('free')}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 text-lg font-semibold"
                >
                  Criar Conta Grátis
                </Button>
              </CardContent>
            </Card>

            {/* Monthly Plan */}
            <Card className="border-2 border-green-200 hover:border-green-300 transition-all duration-200">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Premium Mensal
                </CardTitle>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  R$ 9,70
                  <span className="text-lg font-normal text-gray-600">/mês</span>
                </div>
                <p className="text-gray-600">Flexibilidade total</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Corridas ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Histórico completo</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Metas e desafios</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Gráficos detalhados</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => handlePlanSelection('monthly')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg font-semibold"
                >
                  Assinar Mensal
                </Button>
              </CardContent>
            </Card>

            {/* Lifetime Plan */}
            <Card className="border-2 border-green-500 relative hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Premium Vitalício
                </CardTitle>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  R$ 47
                  <span className="text-lg font-normal text-gray-600">/única vez</span>
                </div>
                <p className="text-gray-600">Acesso completo para sempre</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Corridas ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Histórico completo</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Metas e desafios</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Gráficos detalhados</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Suporte prioritário</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => handlePlanSelection('lifetime')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  Quero Acesso Vitalício
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Already have account */}
          <div className="text-center">
            <p className="text-gray-600">
              Já tem uma conta?{' '}
              <button
                onClick={() => setCurrentView('login')}
                className="text-green-500 hover:text-green-600 font-medium"
              >
                Faça login
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ritmo e Progresso
          </h1>
          <p className="text-gray-600">
            Sua jornada de evolução nas corridas
          </p>
          {selectedPlan !== 'free' && (
            <p className="text-green-600 font-medium mt-2">
              Plano selecionado: {selectedPlan === 'monthly' ? 'Premium Mensal' : 'Premium Vitalício'}
            </p>
          )}
        </div>

        {/* Forms */}
        <div className="space-y-6">
          {currentView === 'signup' && <SignupForm selectedPlan={selectedPlan} />}
          {currentView === 'login' && <LoginForm onForgotPassword={handleForgotPassword} />}
          {currentView === 'forgot' && <ForgotPasswordForm onBack={handleBackToLogin} />}
        </div>

        {/* Navigation */}
        {currentView !== 'forgot' && (
          <div className="text-center space-y-2">
            {currentView === 'signup' ? (
              <>
                <p className="text-gray-600">
                  Já tem uma conta?{' '}
                  <button
                    onClick={() => setCurrentView('login')}
                    className="text-green-500 hover:text-green-600 font-medium"
                  >
                    Faça login
                  </button>
                </p>
                <p className="text-gray-600">
                  <button
                    onClick={handleBackToHome}
                    className="text-gray-500 hover:text-gray-600 text-sm"
                  >
                    ← Voltar para página inicial
                  </button>
                </p>
              </>
            ) : (
              <p className="text-gray-600">
                Não tem uma conta?{' '}
                <button
                  onClick={() => setCurrentView('plans')}
                  className="text-green-500 hover:text-green-600 font-medium"
                >
                  Criar conta grátis
                </button>
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Feito por corredores, para corredores.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
