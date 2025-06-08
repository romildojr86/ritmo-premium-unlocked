
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

type AuthView = 'signup' | 'signin' | 'forgot';

const AuthPage = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<AuthView>('signup');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar se já existe uma sessão ativa
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        navigate('/dashboard');
      }
    };

    checkUser();

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          toast.success('Login realizado com sucesso!');
          // Redirecionar diretamente sem delay
          navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (user) {
    return null; // Redirecionando para dashboard
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
          {currentView === 'signup' && (
            <SignUpForm 
              onSwitchToSignIn={() => setCurrentView('signin')}
            />
          )}
          {currentView === 'signin' && (
            <SignInForm 
              onSwitchToSignUp={() => setCurrentView('signup')}
              onForgotPassword={() => setCurrentView('forgot')}
            />
          )}
          {currentView === 'forgot' && (
            <ForgotPasswordForm 
              onBack={() => setCurrentView('signin')}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Feito por corredores, para corredores.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
