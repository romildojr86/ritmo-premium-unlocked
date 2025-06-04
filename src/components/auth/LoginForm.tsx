
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface LoginFormProps {
  onForgotPassword: () => void;
}

const LoginForm = ({ onForgotPassword }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('E-mail e senha são obrigatórios');
      return;
    }

    // Simulação de login (aqui será integrado com Supabase)
    console.log('Dados de login:', formData);
    
    // Simulação de erro para demonstração
    if (formData.email === 'teste@teste.com' && formData.password === '123456') {
      toast.success('Login realizado com sucesso!');
    } else {
      toast.error('E-mail ou senha incorretos. Verifique seus dados e tente novamente.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-900">Já tem conta? Faça login</CardTitle>
        <CardDescription>
          Acesse sua conta e continue sua evolução
        </CardDescription>
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
            />
          </div>
          
          <div className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
            >
              Entrar
            </Button>
            
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-primary hover:text-primary/80 text-sm underline"
            >
              Esqueci minha senha
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
