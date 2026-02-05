import { useState } from "react";
import {
  Car,
  Lightbulb,
  Wrench,
  ClipboardCheck,
  User,
  Calendar,
  Gauge,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Save,
  RotateCcw,
  Shield,
} from "lucide-react";
import {
  type ChecklistData,
  type ConditionStatus,
  type YesNoNA,
  type VehicleType,
  VEHICLE_TYPE_OPTIONS,
  createEmptyChecklist,
} from "@/types/checklist";
import type { Vehicle } from "@/types/fleet";
import { StatusGroup } from "./StatusButton";
import { VehicleDiagram } from "./VehicleDiagram";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

interface ChecklistFormProps {
  vehicles: Vehicle[];
  initialData?: ChecklistData;
  onSubmit: (data: ChecklistData) => void;
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

/* -------------------------------------------------------------------------- */
/* UI helpers                                                                  */
/* -------------------------------------------------------------------------- */

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
          <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
          <h3 className="section-title">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="p-4 pt-0 border-t border-border">{children}</div>
      </div>
    </div>
  );
};

const FieldRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3 border-b border-border/50 last:border-0">
    <span className="text-sm font-medium text-foreground min-w-[160px]">{label}</span>
    <div className="flex-1">{children}</div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export const ChecklistForm = ({ vehicles, initialData, onSubmit }: ChecklistFormProps) => {
  const [formData, setFormData] = useState<ChecklistData>(initialData || createEmptyChecklist());

  /* ----------------------------- helpers ---------------------------------- */

  const updateField = <K extends keyof ChecklistData>(field: K, value: ChecklistData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateCondition = (field: keyof ChecklistData["vehicleCondition"], value: ConditionStatus) => {
    setFormData((prev) => ({
      ...prev,
      vehicleCondition: { ...prev.vehicleCondition, [field]: value },
    }));
  };

  const updateYesNoGroup = (group: keyof ChecklistData, field: string, value: YesNoNA) => {
    setFormData((prev: any) => ({
      ...prev,
      [group]: { ...prev[group], [field]: value },
    }));
  };

  /* ----------------------------- submit ----------------------------------- */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.vehicle_id) {
      toast.error("Selecione um veículo e preencha o nome do inspetor");
      return;
    }

    onSubmit(formData);
  };

  const handleReset = () => {
    setFormData(createEmptyChecklist());
    toast.info("Formulário limpo");
  };

  /* ------------------------------------------------------------------------ */

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações gerais */}
      <CollapsibleSection title="Informações Gerais" icon={<ClipboardCheck className="h-5 w-5" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Inspetor */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-muted-foreground" />
              Nome do inspetor *
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => updateField("nome", e.target.value)}
              className="input-field w-full"
              required
            />
          </div>

          {/* Data */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Data
            </label>
            <input
              type="date"
              value={formData.data}
              onChange={(e) => updateField("data", e.target.value)}
              className="input-field w-full"
            />
          </div>

          {/* Veículo */}
          <div className="space-y-2 md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Car className="h-4 w-4 text-muted-foreground" />
              Veículo *
            </label>
            <Select value={formData.vehicle_id || ""} onValueChange={(value) => updateField("vehicle_id", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um veículo" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.placa} — {vehicle.modelo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tipo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de veículo</label>
            <Select
              value={formData.tipoVeiculo || ""}
              onValueChange={(v) => updateField("tipoVeiculo", v as VehicleType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value!}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quilometragem */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              Quilometragem
            </label>
            <input
              type="text"
              value={formData.quilometragem}
              onChange={(e) => updateField("quilometragem", e.target.value)}
              className="input-field w-full"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Áreas do veículo */}
      <CollapsibleSection title="Áreas Afetadas" icon={<Car className="h-5 w-5" />} defaultOpen={true}>
        <VehicleDiagram
          markers={formData.areaMarkers}
          onAddMarker={(m) => updateField("areaMarkers", [...formData.areaMarkers, m])}
          onRemoveMarker={(id) =>
            updateField(
              "areaMarkers",
              formData.areaMarkers.filter((m) => m.id !== id),
            )
          }
          vehicleType={formData.tipoVeiculo}
        />
      </CollapsibleSection>

      {/* Condições do Veículo */}
      <CollapsibleSection title="Condições do Veículo" icon={<Car className="h-5 w-5" />} defaultOpen={false}>
        <div className="space-y-1 mt-4">
          <FieldRow label="Limpeza Externa">
            <StatusGroup
              type="condition"
              value={formData.vehicleCondition.limpezaExterna}
              onChange={(v) => updateCondition("limpezaExterna", v as ConditionStatus)}
            />
          </FieldRow>
          <FieldRow label="Limpeza Interna">
            <StatusGroup
              type="condition"
              value={formData.vehicleCondition.limpezaInterna}
              onChange={(v) => updateCondition("limpezaInterna", v as ConditionStatus)}
            />
          </FieldRow>
          <FieldRow label="Pneus">
            <StatusGroup
              type="condition"
              value={formData.vehicleCondition.pneus}
              onChange={(v) => updateCondition("pneus", v as ConditionStatus)}
            />
          </FieldRow>
          <FieldRow label="Estepe">
            <StatusGroup
              type="condition"
              value={formData.vehicleCondition.estepe}
              onChange={(v) => updateCondition("estepe", v as ConditionStatus)}
            />
          </FieldRow>
        </div>
      </CollapsibleSection>

      {/* Luzes Dianteiras */}
      <CollapsibleSection title="Luzes Dianteiras" icon={<Lightbulb className="h-5 w-5" />} defaultOpen={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Esquerda */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Lado Esquerdo</h4>
            <div className="space-y-1">
              <FieldRow label="Farol">
                <StatusGroup
                  type="yesno"
                  value={formData.luzesDianteirasEsquerda.farol}
                  onChange={(v) => updateYesNoGroup("luzesDianteirasEsquerda", "farol", v as YesNoNA)}
                />
              </FieldRow>
              <FieldRow label="Seta">
                <StatusGroup
                  type="yesno"
                  value={formData.luzesDianteirasEsquerda.seta}
                  onChange={(v) => updateYesNoGroup("luzesDianteirasEsquerda", "seta", v as YesNoNA)}
                />
              </FieldRow>
              <FieldRow label="Lanterna">
                <StatusGroup
                  type="yesno"
                  value={formData.luzesDianteirasEsquerda.lanterna}
                  onChange={(v) => updateYesNoGroup("luzesDianteirasEsquerda", "lanterna", v as YesNoNA)}
                />
              </FieldRow>
            </div>
          </div>
          {/* Direita */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Lado Direito</h4>
            <div className="space-y-1">
              <FieldRow label="Farol">
                <StatusGroup
                  type="yesno"
                  value={formData.luzesDianteirasDireita.farol}
                  onChange={(v) => updateYesNoGroup("luzesDianteirasDireita", "farol", v as YesNoNA)}
                />
              </FieldRow>
              <FieldRow label="Seta">
                <StatusGroup
                  type="yesno"
                  value={formData.luzesDianteirasDireita.seta}
                  onChange={(v) => updateYesNoGroup("luzesDianteirasDireita", "seta", v as YesNoNA)}
                />
              </FieldRow>
              <FieldRow label="Lanterna">
                <StatusGroup
                  type="yesno"
                  value={formData.luzesDianteirasDireita.lanterna}
                  onChange={(v) => updateYesNoGroup("luzesDianteirasDireita", "lanterna", v as YesNoNA)}
                />
              </FieldRow>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Luzes Traseiras */}
      <CollapsibleSection title="Luzes Traseiras" icon={<Lightbulb className="h-5 w-5" />} defaultOpen={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Esquerda */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Lado Esquerdo</h4>
            <div className="space-y-1">
              <FieldRow label="Lanterna">
                <StatusGroup
                  type="yesno"
                  value={formData.luzesTraseirasEsquerda.lanterna}
                  onChange={(v) => updateYesNoGroup("luzesTraseirasEsquerda", "lanterna", v as YesNoNA)}
                />
              </FieldRow>
              <FieldRow label="Freio">
                <StatusGroup
                  type="yesno"
                  value={formData.luzesTraseirasEsquerda.freio}
                  onChange={(v) => updateYesNoGroup("luzesTraseirasEsquerda", "freio", v as YesNoNA)}
                />
              </FieldRow>
              <FieldRow label="Seta">
                <StatusGroup
                  type="yesno"
                  value={formData.luzesTraseirasEsquerda.seta}
                  onChange={(v) => updateYesNoGroup("luzesTraseirasEsquerda", "seta", v as YesNoNA)}
                />
              </FieldRow>
              <FieldRow label="Ré">
                <StatusGroup
                  type="yesno"
                  value={formData.luzesTraseirasEsquerda.re}
                  onChange={(v) => updateYesNoGroup("luzesTraseirasEsquerda", "re", v as YesNoNA)}
                />
              </FieldRow>
            </div>
          </div>
          {/* Direita */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Lado Direito</h4>
            <div className="space-y-1">
              <FieldRow label="Lanterna">
                <StatusGroup
                  type="yesno"
                  value={formData.luzesTraseiraDireita.lanterna}
                  onChange={(v) => updateYesNoGroup("luzesTraseiraDireita", "lanterna", v as YesNoNA)}
                />
              </FieldRow>
              <FieldRow label="Freio">
                <StatusGroup
                  type="yesno"
                  value={formData.luzesTraseiraDireita.freio}
                  onChange={(v) => updateYesNoGroup("luzesTraseiraDireita", "freio", v as YesNoNA)}
                />
              </FieldRow>
              <FieldRow label="Seta">
                <StatusGroup
                  type="yesno"
                  value={formData.luzesTraseiraDireita.seta}
                  onChange={(v) => updateYesNoGroup("luzesTraseiraDireita", "seta", v as YesNoNA)}
                />
              </FieldRow>
              <FieldRow label="Ré">
                <StatusGroup
                  type="yesno"
                  value={formData.luzesTraseiraDireita.re}
                  onChange={(v) => updateYesNoGroup("luzesTraseiraDireita", "re", v as YesNoNA)}
                />
              </FieldRow>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Outros Itens */}
      <CollapsibleSection title="Outros Itens" icon={<Shield className="h-5 w-5" />} defaultOpen={false}>
        <div className="space-y-1 mt-4">
          <FieldRow label="Triângulo">
            <StatusGroup
              type="yesno"
              value={formData.otherItems.triangulo}
              onChange={(v) => updateYesNoGroup("otherItems", "triangulo", v as YesNoNA)}
            />
          </FieldRow>
          <FieldRow label="Extintor">
            <StatusGroup
              type="yesno"
              value={formData.otherItems.extintor}
              onChange={(v) => updateYesNoGroup("otherItems", "extintor", v as YesNoNA)}
            />
          </FieldRow>
          <FieldRow label="Macaco">
            <StatusGroup
              type="yesno"
              value={formData.otherItems.macaco}
              onChange={(v) => updateYesNoGroup("otherItems", "macaco", v as YesNoNA)}
            />
          </FieldRow>
          <FieldRow label="Chave de Roda">
            <StatusGroup
              type="yesno"
              value={formData.otherItems.chaveRoda}
              onChange={(v) => updateYesNoGroup("otherItems", "chaveRoda", v as YesNoNA)}
            />
          </FieldRow>
          <FieldRow label="Documentos">
            <StatusGroup
              type="yesno"
              value={formData.otherItems.documentos}
              onChange={(v) => updateYesNoGroup("otherItems", "documentos", v as YesNoNA)}
            />
          </FieldRow>
        </div>
      </CollapsibleSection>

      {/* Verificação Mecânica */}
      <CollapsibleSection title="Verificação Mecânica" icon={<Wrench className="h-5 w-5" />} defaultOpen={false}>
        <div className="space-y-1 mt-4">
          <FieldRow label="Nível de Óleo">
            <StatusGroup
              type="yesno"
              value={formData.mechanicalChecks.nivelOleo}
              onChange={(v) => updateYesNoGroup("mechanicalChecks", "nivelOleo", v as YesNoNA)}
            />
          </FieldRow>
          <FieldRow label="Nível de Água">
            <StatusGroup
              type="yesno"
              value={formData.mechanicalChecks.nivelAgua}
              onChange={(v) => updateYesNoGroup("mechanicalChecks", "nivelAgua", v as YesNoNA)}
            />
          </FieldRow>
          <FieldRow label="Fluido de Freio">
            <StatusGroup
              type="yesno"
              value={formData.mechanicalChecks.fluidoFreio}
              onChange={(v) => updateYesNoGroup("mechanicalChecks", "fluidoFreio", v as YesNoNA)}
            />
          </FieldRow>
          <FieldRow label="Bateria">
            <StatusGroup
              type="yesno"
              value={formData.mechanicalChecks.bateria}
              onChange={(v) => updateYesNoGroup("mechanicalChecks", "bateria", v as YesNoNA)}
            />
          </FieldRow>
          <FieldRow label="Correia">
            <StatusGroup
              type="yesno"
              value={formData.mechanicalChecks.correia}
              onChange={(v) => updateYesNoGroup("mechanicalChecks", "correia", v as YesNoNA)}
            />
          </FieldRow>
        </div>
      </CollapsibleSection>

      {/* Observações */}
      <CollapsibleSection title="Observações" icon={<MessageSquare className="h-5 w-5" />} defaultOpen={false}>
        <textarea
          value={formData.observacoes}
          onChange={(e) => updateField("observacoes", e.target.value)}
          className="input-field w-full min-h-[120px] mt-4"
        />
      </CollapsibleSection>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button data-track={initialData ? "update_checklist" : "save_checklist"} type="submit" className="btn-accent-gradient flex-1 flex items-center justify-center gap-2">
          <Save className="h-5 w-5" />
          Salvar Checklist
        </button>

        <button
          type="button"
          data-track="cancel_checklist" onClick={handleReset}
          className="px-6 py-3 rounded-lg border-2 border-border text-muted-foreground font-semibold hover:bg-muted transition flex items-center justify-center gap-2"
        >
          <RotateCcw className="h-5 w-5" />
          Limpar
        </button>
      </div>
    </form>
  );
};
