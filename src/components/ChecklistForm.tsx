import { useState } from "react";
import { 
  Car, 
  Lightbulb, 
  Wrench, 
  ClipboardCheck,
  User,
  Building2,
  Calendar,
  Hash,
  Gauge,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Save,
  RotateCcw,
  Truck
} from "lucide-react";
import { StatusGroup } from "./StatusButton";
import { VehicleDiagram } from "./VehicleDiagram";
import { 
  type ChecklistData, 
  type ConditionStatus, 
  type YesNoNA,
  type VehicleType,
  VEHICLE_TYPE_OPTIONS,
  createEmptyChecklist 
} from "@/types/checklist";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChecklistFormProps {
  onSubmit: (data: ChecklistData) => void;
  initialData?: ChecklistData;
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection = ({ title, icon, children, defaultOpen = true }: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="card-elevated overflow-hidden animate-fade-in">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <h3 className="section-title">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="p-4 pt-0 border-t border-border">
          {children}
        </div>
      </div>
    </div>
  );
};

interface FieldRowProps {
  label: string;
  children: React.ReactNode;
}

const FieldRow = ({ label, children }: FieldRowProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3 border-b border-border/50 last:border-0">
    <span className="text-sm font-medium text-foreground min-w-[160px]">{label}</span>
    <div className="flex-1">{children}</div>
  </div>
);

export const ChecklistForm = ({ onSubmit, initialData }: ChecklistFormProps) => {
  const [formData, setFormData] = useState<ChecklistData>(initialData || createEmptyChecklist());

  const updateField = <K extends keyof ChecklistData>(field: K, value: ChecklistData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateCondition = (field: keyof ChecklistData['vehicleCondition'], value: ConditionStatus) => {
    setFormData(prev => ({
      ...prev,
      vehicleCondition: { ...prev.vehicleCondition, [field]: value }
    }));
  };

  const updateLightCheck = (
    side: 'luzesDianteirasEsquerda' | 'luzesDianteirasDireita' | 'luzesTraseirasEsquerda' | 'luzesTraseiraDireita',
    field: string,
    value: YesNoNA
  ) => {
    setFormData(prev => ({
      ...prev,
      [side]: { ...prev[side], [field]: value }
    }));
  };

  const updateOtherItem = (field: keyof ChecklistData['otherItems'], value: YesNoNA) => {
    setFormData(prev => ({
      ...prev,
      otherItems: { ...prev.otherItems, [field]: value }
    }));
  };

  const updateMechanicalCheck = (field: keyof ChecklistData['mechanicalChecks'], value: YesNoNA) => {
    setFormData(prev => ({
      ...prev,
      mechanicalChecks: { ...prev.mechanicalChecks, [field]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.veiculo || !formData.placa) {
      toast.error("Preencha os campos obrigatórios: Nome, Veículo e Placa");
      return;
    }
    onSubmit(formData);
    toast.success("Checklist salvo com sucesso!");
  };

  const handleReset = () => {
    setFormData(createEmptyChecklist());
    toast.info("Formulário limpo");
  };

  const lightCheckLabels: Record<string, string> = {
    luzDaPlaca: 'Luz da Placa',
    luzDeRe: 'Luz de Ré',
    seta: 'Seta',
    farolAlto: 'Farol Alto',
    farolBaixo: 'Farol Baixo',
    neblina: 'Neblina',
    luzDeFreio: 'Luz de Freio',
  };

  const otherItemsLabels: Record<string, string> = {
    alarme: 'Alarme',
    buzina: 'Buzina',
    chaveDeRoda: 'Chave de Roda',
    cintos: 'Cintos',
    documentos: 'Documentos',
    seguranca: 'Segurança',
    extintor: 'Extintor',
    limpadores: 'Limpadores',
    macaco: 'Macaco',
    painel: 'Painel',
    retroVisorInterno: 'Retrovisor Interno',
    retroVisorDireito: 'Retrovisor Direito',
    retroVisorEsquerdo: 'Retrovisor Esquerdo',
    travas: 'Travas',
    triangulo: 'Triângulo',
  };

  const mechanicalLabels: Record<string, string> = {
    acelerador: 'Acelerador',
    aguaDoLimpador: 'Água do Limpador',
    aguaDoRadiador: 'Água do Radiador',
    motor: 'Motor',
    embreagem: 'Embreagem',
    freio: 'Freio',
    freioMao: 'Freio de Mão',
    oleoDoFreio: 'Óleo do Freio',
    oleoDoMotor: 'Óleo do Motor',
    tanqueDePartida: 'Tanque de Partida',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Info */}
      <CollapsibleSection title="Informações Gerais" icon={<ClipboardCheck className="h-5 w-5" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <User className="h-4 w-4 text-muted-foreground" />
              Nome *
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => updateField('nome', e.target.value)}
              className="input-field w-full"
              placeholder="Nome do inspetor"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Data
            </label>
            <input
              type="date"
              value={formData.data}
              onChange={(e) => updateField('data', e.target.value)}
              className="input-field w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Truck className="h-4 w-4 text-muted-foreground" />
              Tipo de Veículo
            </label>
            <Select
              value={formData.tipoVeiculo || ""}
              onValueChange={(value) => updateField('tipoVeiculo', value as VehicleType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value!}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Car className="h-4 w-4 text-muted-foreground" />
              Veículo *
            </label>
            <input
              type="text"
              value={formData.veiculo}
              onChange={(e) => updateField('veiculo', e.target.value)}
              className="input-field w-full"
              placeholder="Modelo do veículo"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              Empresa
            </label>
            <input
              type="text"
              value={formData.empresa}
              onChange={(e) => updateField('empresa', e.target.value)}
              className="input-field w-full"
              placeholder="Nome da empresa"
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Hash className="h-4 w-4 text-muted-foreground" />
              Placa *
            </label>
            <input
              type="text"
              value={formData.placa}
              onChange={(e) => updateField('placa', e.target.value.toUpperCase())}
              className="input-field w-full"
              placeholder="ABC-1234"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              Quilometragem
            </label>
            <input
              type="text"
              value={formData.quilometragem}
              onChange={(e) => updateField('quilometragem', e.target.value)}
              className="input-field w-full"
              placeholder="Ex: 45.000 km"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Vehicle Diagram */}
      <CollapsibleSection title="Áreas Afetadas do Veículo" icon={<Car className="h-5 w-5" />}>
        <div className="mt-4">
          <VehicleDiagram
            markers={formData.areaMarkers}
            onAddMarker={(marker) => updateField('areaMarkers', [...formData.areaMarkers, marker])}
            onRemoveMarker={(id) => updateField('areaMarkers', formData.areaMarkers.filter(m => m.id !== id))}
            vehicleType={formData.tipoVeiculo}
          />
        </div>
      </CollapsibleSection>

      {/* Vehicle Condition */}
      <CollapsibleSection title="Condições do Veículo" icon={<ClipboardCheck className="h-5 w-5" />}>
        <div className="mt-4 space-y-1">
          <FieldRow label="Limpeza Externa">
            <StatusGroup
              type="condition"
              value={formData.vehicleCondition.limpezaExterna}
              onChange={(v) => updateCondition('limpezaExterna', v as ConditionStatus)}
              size="sm"
            />
          </FieldRow>
          <FieldRow label="Limpeza Interna">
            <StatusGroup
              type="condition"
              value={formData.vehicleCondition.limpezaInterna}
              onChange={(v) => updateCondition('limpezaInterna', v as ConditionStatus)}
              size="sm"
            />
          </FieldRow>
          <FieldRow label="Pneus">
            <StatusGroup
              type="condition"
              value={formData.vehicleCondition.pneus}
              onChange={(v) => updateCondition('pneus', v as ConditionStatus)}
              size="sm"
            />
          </FieldRow>
          <FieldRow label="Estepe">
            <StatusGroup
              type="condition"
              value={formData.vehicleCondition.estepe}
              onChange={(v) => updateCondition('estepe', v as ConditionStatus)}
              size="sm"
            />
          </FieldRow>
        </div>
      </CollapsibleSection>

      {/* Front Lights */}
      <CollapsibleSection title="Luzes Dianteiras" icon={<Lightbulb className="h-5 w-5" />} defaultOpen={false}>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-primary mb-3">Esquerda</h4>
            <div className="space-y-1">
              {Object.entries(lightCheckLabels).map(([key, label]) => (
                <FieldRow key={`front-left-${key}`} label={label}>
                  <StatusGroup
                    type="yesno"
                    value={formData.luzesDianteirasEsquerda[key as keyof typeof formData.luzesDianteirasEsquerda]}
                    onChange={(v) => updateLightCheck('luzesDianteirasEsquerda', key, v as YesNoNA)}
                    size="sm"
                  />
                </FieldRow>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-primary mb-3">Direita</h4>
            <div className="space-y-1">
              {Object.entries(lightCheckLabels).map(([key, label]) => (
                <FieldRow key={`front-right-${key}`} label={label}>
                  <StatusGroup
                    type="yesno"
                    value={formData.luzesDianteirasDireita[key as keyof typeof formData.luzesDianteirasDireita]}
                    onChange={(v) => updateLightCheck('luzesDianteirasDireita', key, v as YesNoNA)}
                    size="sm"
                  />
                </FieldRow>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Rear Lights */}
      <CollapsibleSection title="Luzes Traseiras" icon={<Lightbulb className="h-5 w-5" />} defaultOpen={false}>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-primary mb-3">Esquerda</h4>
            <div className="space-y-1">
              {Object.entries(lightCheckLabels).map(([key, label]) => (
                <FieldRow key={`rear-left-${key}`} label={label}>
                  <StatusGroup
                    type="yesno"
                    value={formData.luzesTraseirasEsquerda[key as keyof typeof formData.luzesTraseirasEsquerda]}
                    onChange={(v) => updateLightCheck('luzesTraseirasEsquerda', key, v as YesNoNA)}
                    size="sm"
                  />
                </FieldRow>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-primary mb-3">Direita</h4>
            <div className="space-y-1">
              {Object.entries(lightCheckLabels).map(([key, label]) => (
                <FieldRow key={`rear-right-${key}`} label={label}>
                  <StatusGroup
                    type="yesno"
                    value={formData.luzesTraseiraDireita[key as keyof typeof formData.luzesTraseiraDireita]}
                    onChange={(v) => updateLightCheck('luzesTraseiraDireita', key, v as YesNoNA)}
                    size="sm"
                  />
                </FieldRow>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Other Items */}
      <CollapsibleSection title="Outros Itens" icon={<ClipboardCheck className="h-5 w-5" />} defaultOpen={false}>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-x-6">
          {Object.entries(otherItemsLabels).map(([key, label]) => (
            <FieldRow key={key} label={label}>
              <StatusGroup
                type="yesno"
                value={formData.otherItems[key as keyof typeof formData.otherItems]}
                onChange={(v) => updateOtherItem(key as keyof typeof formData.otherItems, v as YesNoNA)}
                size="sm"
              />
            </FieldRow>
          ))}
        </div>
      </CollapsibleSection>

      {/* Mechanical Checks */}
      <CollapsibleSection title="Verificações Mecânicas" icon={<Wrench className="h-5 w-5" />} defaultOpen={false}>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-x-6">
          {Object.entries(mechanicalLabels).map(([key, label]) => (
            <FieldRow key={key} label={label}>
              <StatusGroup
                type="yesno"
                value={formData.mechanicalChecks[key as keyof typeof formData.mechanicalChecks]}
                onChange={(v) => updateMechanicalCheck(key as keyof typeof formData.mechanicalChecks, v as YesNoNA)}
                size="sm"
              />
            </FieldRow>
          ))}
        </div>
      </CollapsibleSection>

      {/* Observations */}
      <CollapsibleSection title="Observações" icon={<MessageSquare className="h-5 w-5" />}>
        <div className="mt-4">
          <textarea
            value={formData.observacoes}
            onChange={(e) => updateField('observacoes', e.target.value)}
            className="input-field w-full min-h-[120px] resize-y"
            placeholder="Adicione observações adicionais sobre a inspeção..."
          />
        </div>
      </CollapsibleSection>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="submit"
          className="btn-accent-gradient flex-1 flex items-center justify-center gap-2"
        >
          <Save className="h-5 w-5" />
          Salvar Checklist
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-6 py-3 rounded-lg border-2 border-border text-muted-foreground font-semibold hover:bg-muted transition-all duration-200 flex items-center justify-center gap-2"
        >
          <RotateCcw className="h-5 w-5" />
          Limpar
        </button>
      </div>
    </form>
  );
};
