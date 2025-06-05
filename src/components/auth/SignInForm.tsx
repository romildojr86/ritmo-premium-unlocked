
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onForgotPassword: () => void;
}

const SignInForm = ({ onSwitchToSignUp, onForgotPassword }: SignInFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('E-mail e senha são obrigatórios');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('E-mail ou senha incorretos. Verifique seus dados e tente novamente.');
        } else {
          toast.error('Erro ao fazer login: ' + error.message);
        }
      }
      // O sucesso será tratado pelo onAuthStateChange no componente pai
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Card className="w-full border-gray-200">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Entrar na minha conta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="loginEmail">E-mail</Label>
            <Input
              id="loginEmail"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loginPassword">Senha</Label>
            <Input
              id="loginPassword"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              required
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg font-semibold"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-green-500 hover:text-green-600 text-sm underline"
            >
              Esqueci minha senha
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Não tem conta?{' '}
            <button
              onClick={onSwitchToSignUp}
              className="text-green-500 hover:text-green-600 font-medium"
            >
              Criar conta grátis
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignInForm;
