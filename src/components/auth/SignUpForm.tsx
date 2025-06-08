
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
}

const SignUpForm = ({ onSwitchToSignIn }: SignUpFormProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.password) {
      toast.error('Nome, e-mail e senha são obrigatórios');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (authError) {
        if (authError.message.includes('User already registered')) {
          toast.error('Este e-mail já está cadastrado. Tente fazer login.');
        } else {
          toast.error('Erro ao criar conta: ' + authError.message);
        }
        return;
      }

      if (authData.user) {
        // 2. Inserir dados na tabela users (o trigger configurará automaticamente o trial premium)
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone || null
            // status, plano, assinou_em e expira_em serão configurados automaticamente pelo trigger
          });

        if (insertError) {
          console.error('Erro ao inserir dados do usuário:', insertError);
          toast.error('Conta criada, mas houve um erro ao salvar dados adicionais');
        } else {
          toast.success('Conta criada com sucesso! Seu trial premium de 7 dias foi ativado. Verifique seu e-mail para confirmar.');
        }
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao criar conta');
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
          Crie sua conta grátis
        </CardTitle>
        <p className="text-gray-600 mt-2">
          7 dias de acesso Premium inclusos
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Seu nome completo"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
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
            <Label htmlFor="telefone">WhatsApp</Label>
            <Input
              id="telefone"
              name="telefone"
              type="tel"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="+55 11 91234-5678"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              required
              minLength={6}
              className="w-full"
            />
            <p className="text-sm text-gray-600">Mínimo 6 caracteres</p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg font-semibold"
          >
            {isLoading ? 'Criando conta...' : '🎉 Criar Conta Premium (7 dias grátis)'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Já tem conta?{' '}
            <button
              onClick={onSwitchToSignIn}
              className="text-green-500 hover:text-green-600 font-medium"
            >
              Entrar na minha conta
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;
