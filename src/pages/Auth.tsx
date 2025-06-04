
import React, { useState } from 'react';
import SignupForm from '@/components/auth/SignupForm';
import LoginForm from '@/components/auth/LoginForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

type AuthView = 'login' | 'signup' | 'forgot';

const Auth = () => {
  const [currentView, setCurrentView] = useState<AuthView>('signup');

  const handleForgotPassword = () => {
    setCurrentView('forgot');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
  };

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
        </div>

        {/* Forms */}
        <div className="space-y-6">
          {currentView === 'signup' && <SignupForm />}
          {currentView === 'login' && <LoginForm onForgotPassword={handleForgotPassword} />}
          {currentView === 'forgot' && <ForgotPasswordForm onBack={handleBackToLogin} />}
        </div>

        {/* Toggle between login and signup */}
        {currentView !== 'forgot' && (
          <div className="text-center">
            {currentView === 'signup' ? (
              <p className="text-gray-600">
                Já tem uma conta?{' '}
                <button
                  onClick={() => setCurrentView('login')}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Faça login
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                Não tem uma conta?{' '}
                <button
                  onClick={() => setCurrentView('signup')}
                  className="text-primary hover:text-primary/80 font-medium"
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
