import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  VEHICLE_TYPE_OPTIONS, 
  VEHICLE_STATUS_OPTIONS,
  type Vehicle, 
  type VehicleFormData 
} from "@/types/fleet";
import { Car, Save, X } from "lucide-react";
import { toast } from "sonner";

interface VehicleFormProps {
  initialData?: Vehicle | null;
  onSubmit: (data: VehicleFormData) => Promise<void>;
  onCancel: () => void;
}

export const VehicleForm = ({ initialData, onSubmit, onCancel }: VehicleFormProps) => {
  const [formData, setFormData] = useState<VehicleFormData>({
    placa: initialData?.placa || '',
    modelo: initialData?.modelo || '',
    tipo: initialData?.tipo || 'carro_passeio',
    marca: initialData?.marca || '',
    ano: initialData?.ano || undefined,
    cor: initialData?.cor || '',
    empresa: initialData?.empresa || '',
    quilometragem_atual: initialData?.quilometragem_atual || 0,
    status: initialData?.status || 'ativo',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.placa || !formData.modelo || !formData.tipo) {
      toast.error("Preencha os campos obrigatórios: Placa, Modelo e Tipo");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="card-elevated animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5 text-primary" />
          {initialData ? 'Editar Veículo' : 'Cadastrar Veículo'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Placa */}
            <div className="space-y-2">
              <Label htmlFor="placa">Placa *</Label>
              <Input
                id="placa"
                value={formData.placa}
                onChange={(e) => setFormData({ ...formData, placa: e.target.value.toUpperCase() })}
                placeholder="ABC-1234"
                required
              />
            </div>

            {/* Modelo */}
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo *</Label>
              <Input
                id="modelo"
                value={formData.modelo}
                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                placeholder="Ex: Fiat Strada"
                required
              />
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label>Tipo *</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => setFormData({ ...formData, tipo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Marca */}
            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                value={formData.marca || ''}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                placeholder="Ex: Fiat"
              />
            </div>

            {/* Ano */}
            <div className="space-y-2">
              <Label htmlFor="ano">Ano</Label>
              <Input
                id="ano"
                type="number"
                value={formData.ano || ''}
                onChange={(e) => setFormData({ ...formData, ano: e.target.value ? parseInt(e.target.value) : undefined })}
                placeholder="Ex: 2023"
                min={1900}
                max={new Date().getFullYear() + 1}
              />
            </div>

            {/* Cor */}
            <div className="space-y-2">
              <Label htmlFor="cor">Cor</Label>
              <Input
                id="cor"
                value={formData.cor || ''}
                onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                placeholder="Ex: Branco"
              />
            </div>

            {/* Empresa */}
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Input
                id="empresa"
                value={formData.empresa || ''}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                placeholder="Nome da empresa"
              />
            </div>

            {/* Quilometragem */}
            <div className="space-y-2">
              <Label htmlFor="quilometragem">Quilometragem Atual</Label>
              <Input
                id="quilometragem"
                type="number"
                value={formData.quilometragem_atual || ''}
                onChange={(e) => setFormData({ ...formData, quilometragem_atual: parseInt(e.target.value) || 0 })}
                placeholder="Ex: 45000"
                min={0}
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={submitting} 
              className="flex-1 gap-2"
              data-track={initialData ? "update_veiculo" : "cadastrar_veiculo"}
            >
              <Save className="h-4 w-4" />
              {submitting ? 'Salvando...' : (initialData ? 'Atualizar' : 'Cadastrar')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="gap-2">
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
