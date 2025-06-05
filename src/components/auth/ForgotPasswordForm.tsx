
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('E-mail é obrigatório');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) {
        toast.error('Erro ao enviar e-mail: ' + error.message);
      } else {
        toast.success('Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.');
        setEmail('');
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao enviar e-mail');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full border-gray-200">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="text-green-500 hover:text-green-600"
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
              className="w-full"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg font-semibold"
          >
            {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
