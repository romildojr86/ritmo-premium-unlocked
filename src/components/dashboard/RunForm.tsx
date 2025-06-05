
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

interface RunFormProps {
  onRunAdded: () => void;
}

const RunForm = ({ onRunAdded }: RunFormProps) => {
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    distancia_km: '',
    tempo_min: '',
    notas: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.distancia_km || !formData.tempo_min) {
      toast.error('Por favor, preencha distância e tempo');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Usuário não autenticado');
        return;
      }

      const { error } = await supabase
        .from('corridas')
        .insert({
          user_id: session.user.id,
          data: formData.data,
          distancia_km: parseFloat(formData.distancia_km),
          tempo_min: parseInt(formData.tempo_min),
          notas: formData.notas || null
        });

      if (error) throw error;

      setFormData({
        data: new Date().toISOString().split('T')[0],
        distancia_km: '',
        tempo_min: '',
        notas: ''
      });

      onRunAdded();
    } catch (error) {
      console.error('Erro ao registrar corrida:', error);
      toast.error('Erro ao registrar corrida');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="data">Data</Label>
          <Input
            id="data"
            type="date"
            value={formData.data}
            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="distancia">Distância (km)</Label>
          <Input
            id="distancia"
            type="number"
            step="0.1"
            placeholder="5.2"
            value={formData.distancia_km}
            onChange={(e) => setFormData({ ...formData, distancia_km: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="tempo">Tempo (minutos)</Label>
        <Input
          id="tempo"
          type="number"
          placeholder="30"
          value={formData.tempo_min}
          onChange={(e) => setFormData({ ...formData, tempo_min: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="notas">Notas (opcional)</Label>
        <Textarea
          id="notas"
          placeholder="Como foi a corrida hoje..."
          value={formData.notas}
          onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
          rows={3}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registrando...' : 'Registrar Corrida'}
      </Button>
    </form>
  );
};

export default RunForm;
