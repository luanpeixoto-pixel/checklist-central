import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FUEL_TYPE_OPTIONS,
  type Vehicle,
  type FuelRecord,
  type FuelFormData,
} from "@/types/fleet";
import { Fuel, Save, X } from "lucide-react";
import { toast } from "sonner";

interface FuelFormProps {
  vehicles: Vehicle[];
  initialData?: FuelRecord | null;
  onSubmit: (data: FuelFormData) => Promise<void>;
  onCancel: () => void;
}

const isBlank = (value: string | null | undefined) => !value?.trim();

export const FuelForm = ({ vehicles, initialData, onSubmit, onCancel }: FuelFormProps) => {
  const getBrazilNow = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const brazilOffset = 180; // UTC-3 in minutes
    const diff = offset - brazilOffset;
    const brazilTime = new Date(now.getTime() - diff * 60000);
    return brazilTime.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState<FuelFormData>({
    vehicle_id: initialData?.vehicle_id || "",
    data_abastecimento: initialData?.data_abastecimento
      ? new Date(initialData.data_abastecimento).toISOString().slice(0, 16)
      : getBrazilNow(),
    posto: initialData?.posto || "",
    tipo_combustivel: initialData?.tipo_combustivel || "gasolina_comum",
    litros: initialData?.litros || 0,
    valor_total: initialData?.valor_total || 0,
    quilometragem: initialData?.quilometragem || 0,
    tanque_cheio: initialData?.tanque_cheio ?? true,
    condutor: initialData?.condutor || "",
    observacoes: initialData?.observacoes || "",
  });

  const [submitting, setSubmitting] = useState(false);

  const valorPorLitro = formData.litros > 0 ? formData.valor_total / formData.litros : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missingFields: string[] = [];
    if (isBlank(formData.vehicle_id)) missingFields.push("Veículo");
    if (isBlank(formData.data_abastecimento)) missingFields.push("Data e Hora");
    if (isBlank(formData.tipo_combustivel)) missingFields.push("Tipo de Combustível");
    if (formData.litros <= 0) missingFields.push("Litros");
    if (formData.valor_total <= 0) missingFields.push("Valor Total");
    if (formData.quilometragem === null || formData.quilometragem === undefined || formData.quilometragem < 0) {
      missingFields.push("Quilometragem");
    }
    if (isBlank(formData.posto ?? "")) missingFields.push("Posto");
    if (isBlank(formData.condutor ?? "")) missingFields.push("Condutor");

    if (missingFields.length > 0) {
      toast.error(`Preencha os campos obrigatórios: ${missingFields.join(", ")}`);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedVehicle = vehicles.find((v) => v.id === formData.vehicle_id);

  return (
    <Card className="card-elevated animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fuel className="h-5 w-5 text-primary" />
          {initialData ? "Editar Abastecimento" : "Registrar Abastecimento"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Veículo *</Label>
              <Select
                value={formData.vehicle_id}
                onValueChange={(value) => {
                  const vehicle = vehicles.find((v) => v.id === value);
                  setFormData({
                    ...formData,
                    vehicle_id: value,
                    quilometragem: vehicle?.quilometragem_atual || formData.quilometragem,
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

            <div className="space-y-2">
              <Label>Data e Hora *</Label>
              <Input
                type="datetime-local"
                value={formData.data_abastecimento}
                onChange={(e) => setFormData({ ...formData, data_abastecimento: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de Combustível *</Label>
              <Select value={formData.tipo_combustivel} onValueChange={(value) => setFormData({ ...formData, tipo_combustivel: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {FUEL_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Litros *</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.litros || ""}
                onChange={(e) => setFormData({ ...formData, litros: parseFloat(e.target.value) || 0 })}
                placeholder="0,00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Valor Total (R$) *</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.valor_total || ""}
                onChange={(e) => setFormData({ ...formData, valor_total: parseFloat(e.target.value) || 0 })}
                placeholder="0,00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>R$/Litro</Label>
              <Input type="text" value={valorPorLitro > 0 ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorPorLitro) : "-"} disabled className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label>Quilometragem *</Label>
              <Input
                type="number"
                min="0"
                value={formData.quilometragem || ""}
                onChange={(e) => setFormData({ ...formData, quilometragem: parseInt(e.target.value, 10) || 0 })}
                placeholder={selectedVehicle ? `Atual: ${selectedVehicle.quilometragem_atual}` : "km"}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Posto *</Label>
              <Input
                value={formData.posto || ""}
                onChange={(e) => setFormData({ ...formData, posto: e.target.value })}
                placeholder="Nome do posto"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Condutor *</Label>
              <Input
                value={formData.condutor || ""}
                onChange={(e) => setFormData({ ...formData, condutor: e.target.value })}
                placeholder="Nome do condutor"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="tanque_cheio"
              checked={formData.tanque_cheio}
              onCheckedChange={(checked) => setFormData({ ...formData, tanque_cheio: checked === true })}
            />
            <Label htmlFor="tanque_cheio" className="text-sm font-normal cursor-pointer">
              Completou o tanque
            </Label>
          </div>

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              value={formData.observacoes || ""}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações adicionais..."
              rows={2}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button data-track={initialData ? "update_fuel" : "save_fuel"} type="submit" disabled={submitting} className="flex-1 gap-2">
              <Save className="h-4 w-4" />
              {submitting ? "Salvando..." : initialData ? "Atualizar" : "Registrar"}
            </Button>
            <Button data-track="cancel_fuel" type="button" variant="outline" onClick={onCancel} className="gap-2">
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
