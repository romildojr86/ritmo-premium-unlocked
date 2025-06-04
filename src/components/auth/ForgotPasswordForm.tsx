
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('E-mail é obrigatório');
      return;
    }

    // Simulação de envio de email (aqui será integrado com Supabase)
    console.log('Recuperação de senha para:', email);
    toast.success('Enviamos um link de recuperação para seu e-mail.');
    setEmail('');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <CardTitle className="text-2xl text-gray-900">Recuperar senha</CardTitle>
        </div>
        <CardDescription>
          Digite seu e-mail para receber o link de redefinição de senha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recoveryEmail">E-mail</Label>
            <Input
              id="recoveryEmail"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90"
          >
            Enviar Link de Recuperação
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
