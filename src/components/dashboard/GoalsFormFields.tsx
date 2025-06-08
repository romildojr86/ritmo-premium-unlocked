
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Goals } from '@/hooks/useGoals';

interface GoalsFormFieldsProps {
  formData: Goals;
  onFormDataChange: (data: Goals) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  loading: boolean;
}

const GoalsFormFields = ({ 
  formData, 
  onFormDataChange, 
  onSubmit, 
  saving, 
  loading 
}: GoalsFormFieldsProps) => {
  const handleInputChange = (field: keyof Goals, value: string) => {
    // Convert empty string to 0, otherwise parse as float
    const numValue = value === '' ? 0 : parseFloat(value) || 0;
    onFormDataChange({ ...formData, [field]: numValue });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that all values are valid numbers (including 0)
    const isValid = 
      !isNaN(formData.meta_semanal) && 
      !isNaN(formData.meta_mensal) && 
      !isNaN(formData.meta_anual) &&
      formData.meta_semanal >= 0 &&
      formData.meta_mensal >= 0 &&
      formData.meta_anual >= 0;

    if (isValid) {
      console.log('📝 Enviando metas:', formData);
      onSubmit(e);
    } else {
      console.error('❌ Valores inválidos nas metas:', formData);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="meta_semanal">Meta Semanal (km)</Label>
          <Input
            id="meta_semanal"
            type="number"
            step="0.1"
            min="0"
            placeholder="15.0"
            value={formData.meta_semanal === 0 ? '' : formData.meta_semanal}
            onChange={(e) => handleInputChange('meta_semanal', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="meta_mensal">Meta Mensal (km)</Label>
          <Input
            id="meta_mensal"
            type="number"
            step="0.1"
            min="0"
            placeholder="60.0"
            value={formData.meta_mensal === 0 ? '' : formData.meta_mensal}
            onChange={(e) => handleInputChange('meta_mensal', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="meta_anual">Meta Anual (km)</Label>
          <Input
            id="meta_anual"
            type="number"
            step="0.1"
            min="0"
            placeholder="720.0"
            value={formData.meta_anual === 0 ? '' : formData.meta_anual}
            onChange={(e) => handleInputChange('meta_anual', e.target.value)}
          />
        </div>
      </div>
      <Button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={saving || loading}
      >
        {saving ? 'Salvando...' : 'Salvar Metas'}
      </Button>
    </form>
  );
};

export default GoalsFormFields;
