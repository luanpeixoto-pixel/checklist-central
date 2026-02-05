import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MAINTENANCE_TYPE_OPTIONS, 
  MAINTENANCE_GROUP_OPTIONS,
  MAINTENANCE_ITEMS,
  type Vehicle, 
  type MaintenanceRecord,
  type MaintenanceFormData,
  type MaintenanceGroup
} from "@/types/fleet";
import { Wrench, Save, X } from "lucide-react";
import { toast } from "sonner";

interface MaintenanceFormProps {
  vehicles: Vehicle[];
  initialData?: MaintenanceRecord | null;
  onSubmit: (data: MaintenanceFormData) => Promise<void>;
  onCancel: () => void;
}

export const MaintenanceForm = ({ vehicles, initialData, onSubmit, onCancel }: MaintenanceFormProps) => {
  const [formData, setFormData] = useState<MaintenanceFormData>({
    vehicle_id: initialData?.vehicle_id || '',
    tipo_manutencao: initialData?.tipo_manutencao || 'preventiva',
    grupo: initialData?.grupo || undefined,
    item: initialData?.item || '',
    descricao: initialData?.descricao || '',
    custo: initialData?.custo || 0,
    quilometragem_atual: initialData?.quilometragem_atual || undefined,
    quilometragem_proxima: initialData?.quilometragem_proxima || undefined,
    data_manutencao: initialData?.data_manutencao || new Date().toISOString().split('T')[0],
    data_proxima: initialData?.data_proxima || undefined,
    fornecedor: initialData?.fornecedor || '',
    nota_fiscal: initialData?.nota_fiscal || '',
    status: initialData?.status || 'realizada',
    observacoes: initialData?.observacoes || '',
  });

  const [submitting, setSubmitting] = useState(false);

  const selectedGroup = formData.grupo as MaintenanceGroup | undefined;
  const itemOptions = selectedGroup ? MAINTENANCE_ITEMS[selectedGroup] : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vehicle_id || !formData.item || !formData.data_manutencao) {
      toast.error("Preencha os campos obrigatórios: Veículo, Item e Data");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicle_id);

  return (
    <Card className="card-elevated animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-primary" />
          {initialData ? 'Editar Manutenção' : 'Registrar Manutenção'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Veículo */}
            <div className="space-y-2">
              <Label>Veículo *</Label>
              <Select
                value={formData.vehicle_id}
                onValueChange={(value) => {
                  const vehicle = vehicles.find(v => v.id === value);
                  setFormData({ 
                    ...formData, 
                    vehicle_id: value,
                    quilometragem_atual: vehicle?.quilometragem_atual
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o veículo" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.placa} - {vehicle.modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label>Tipo de Manutenção *</Label>
              <Select
                value={formData.tipo_manutencao}
                onValueChange={(value) => setFormData({ ...formData, tipo_manutencao: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {MAINTENANCE_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Grupo */}
            <div className="space-y-2">
              <Label>Grupo</Label>
              <Select
                value={formData.grupo || ''}
                onValueChange={(value) => setFormData({ ...formData, grupo: value || undefined, item: '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o grupo" />
                </SelectTrigger>
                <SelectContent>
                  {MAINTENANCE_GROUP_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Item */}
            <div className="space-y-2">
              <Label>Item *</Label>
              {itemOptions.length > 0 ? (
                <Select
                  value={formData.item}
                  onValueChange={(value) => setFormData({ ...formData, item: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o item" />
                  </SelectTrigger>
                  <SelectContent>
                    {itemOptions.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  placeholder="Ex: Troca de óleo"
                  required
                />
              )}
            </div>

            {/* Data */}
            <div className="space-y-2">
              <Label>Data da Manutenção *</Label>
              <Input
                type="date"
                value={formData.data_manutencao}
                onChange={(e) => setFormData({ ...formData, data_manutencao: e.target.value })}
                required
              />
            </div>

            {/* Custo */}
            <div className="space-y-2">
              <Label>Custo (R$)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.custo || ''}
                onChange={(e) => setFormData({ ...formData, custo: parseFloat(e.target.value) || 0 })}
                placeholder="0,00"
              />
            </div>

            {/* Km Atual */}
            <div className="space-y-2">
              <Label>Quilometragem Atual</Label>
              <Input
                type="number"
                value={formData.quilometragem_atual || ''}
                onChange={(e) => setFormData({ ...formData, quilometragem_atual: parseInt(e.target.value) || undefined })}
                placeholder={selectedVehicle ? `Atual: ${selectedVehicle.quilometragem_atual}` : 'km'}
              />
            </div>

            {/* Km Próxima */}
            <div className="space-y-2">
              <Label>Próxima Troca (km)</Label>
              <Input
                type="number"
                value={formData.quilometragem_proxima || ''}
                onChange={(e) => setFormData({ ...formData, quilometragem_proxima: parseInt(e.target.value) || undefined })}
                placeholder="km para próxima manutenção"
              />
            </div>

            {/* Data Próxima */}
            <div className="space-y-2">
              <Label>Próxima Revisão</Label>
              <Input
                type="date"
                value={formData.data_proxima || ''}
                onChange={(e) => setFormData({ ...formData, data_proxima: e.target.value || undefined })}
              />
            </div>

            {/* Fornecedor */}
            <div className="space-y-2">
              <Label>Fornecedor/Oficina</Label>
              <Input
                value={formData.fornecedor || ''}
                onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
                placeholder="Nome do fornecedor"
              />
            </div>

            {/* Nota Fiscal */}
            <div className="space-y-2">
              <Label>Nota Fiscal</Label>
              <Input
                value={formData.nota_fiscal || ''}
                onChange={(e) => setFormData({ ...formData, nota_fiscal: e.target.value })}
                placeholder="Número da NF"
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
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realizada">Realizada</SelectItem>
                  <SelectItem value="agendada">Agendada</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea
              value={formData.descricao || ''}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Detalhes da manutenção..."
              rows={2}
            />
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              value={formData.observacoes || ''}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações adicionais..."
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={submitting} 
              className="flex-1 gap-2"
              data-track={initialData ? "update_manutencao" : "salvar_manutencao"}
            >
              <Save className="h-4 w-4" />
              {submitting ? 'Salvando...' : (initialData ? 'Atualizar' : 'Registrar')}
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
