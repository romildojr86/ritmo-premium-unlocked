
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SignupFormProps {
  selectedPlan?: 'free' | 'monthly' | 'lifetime';
}

const SignupForm: React.FC<SignupFormProps> = ({ selectedPlan = 'free' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Simulated signup process
    setTimeout(() => {
      setMessage('Conta criada com sucesso! Agora é só acessar seu dashboard.');
      setIsLoading(false);
      console.log('Signup data:', { ...formData, plan: selectedPlan });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getPlanTitle = () => {
    switch (selectedPlan) {
      case 'monthly':
        return 'Premium Mensal (R$ 9,70/mês)';
      case 'lifetime':
        return 'Premium Vitalício (R$ 47)';
      default:
        return 'Gratuito';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-gray-900">
          Crie sua conta {selectedPlan === 'free' ? 'grátis' : 'premium'}
        </CardTitle>
        <p className="text-center text-gray-600">
          Plano selecionado: {getPlanTitle()}
        </p>
      </CardHeader>
      <CardContent>
        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md">
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              placeholder="ex: +55 11 91234-5678"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              className="w-full"
            />
            <p className="text-sm text-gray-600">Mínimo 6 caracteres</p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg font-semibold"
          >
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
