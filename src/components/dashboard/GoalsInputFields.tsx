
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GoalsInputFieldsProps {
  metaSemanal: number;
  setMetaSemanal: (value: number) => void;
  metaMensal: number;
  setMetaMensal: (value: number) => void;
  metaAnual: number;
  setMetaAnual: (value: number) => void;
}

const GoalsInputFields = ({
  metaSemanal,
  setMetaSemanal,
  metaMensal,
  setMetaMensal,
  metaAnual,
  setMetaAnual
}: GoalsInputFieldsProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="meta_semanal">Meta Semanal (km)</Label>
        <Input
          id="meta_semanal"
          name="meta_semanal"
          type="number"
          step="0.1"
          min="0"
          placeholder="15.0"
          value={metaSemanal}
          onChange={(e) => setMetaSemanal(Number(e.target.value) || 0)}
        />
      </div>
      <div>
        <Label htmlFor="meta_mensal">Meta Mensal (km)</Label>
        <Input
          id="meta_mensal"
          name="meta_mensal"
          type="number"
          step="0.1"
          min="0"
          placeholder="60.0"
          value={metaMensal}
          onChange={(e) => setMetaMensal(Number(e.target.value) || 0)}
        />
      </div>
      <div>
        <Label htmlFor="meta_anual">Meta Anual (km)</Label>
        <Input
          id="meta_anual"
          name="meta_anual"
          type="number"
          step="0.1"
          min="0"
          placeholder="720.0"
          value={metaAnual}
          onChange={(e) => setMetaAnual(Number(e.target.value) || 0)}
        />
      </div>
    </div>
  );
};

export default GoalsInputFields;
