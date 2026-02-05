import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PopupDefinition, PopupTrigger, TriggerCategory, TriggerConditions } from "@/types/popup";

interface TriggerFormData {
  popup_id: string;
  trigger_category: TriggerCategory;
  trigger_type: string;
  // Action conditions
  event_type: string;
  event_name: string;
  event_count: number;
  page_path: string;
  page_count: number;
  time_seconds: number;
  scroll_percent: number;
  // Profile conditions
  min_vehicles: number;
  vehicle_status: string;
  min_maintenance_amount: number;
  maintenance_period_days: number;
  min_fuel_records: number;
  fuel_period_days: number;
  // Common
  priority: number;
  max_displays: number | null;
  cooldown_hours: number | null;
  is_active: boolean;
}

interface TriggerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: PopupTrigger | null;
  popupId: string | null;
  popups: PopupDefinition[];
  onSave: (data: Omit<PopupTrigger, "id" | "created_at">) => void;
}

const ACTION_TRIGGER_TYPES = [
  { value: "event_count", label: "Clicou X vezes", description: "Baseado em cliques/eventos" },
  { value: "page_view", label: "Visualizou X páginas", description: "Quantidade de páginas vistas" },
  { value: "time_on_page", label: "Tempo na página", description: "Segundos na página" },
  { value: "scroll_depth", label: "Scroll na página", description: "% de scroll" },
];

const PROFILE_TRIGGER_TYPES = [
  { value: "vehicle_count", label: "Quantidade de veículos", description: "Tem X veículos cadastrados" },
  { value: "maintenance_spent", label: "Gastos em manutenção", description: "Gastou R$ em manutenção" },
  { value: "fuel_count", label: "Registros de combustível", description: "Tem X abastecimentos" },
];

export const TriggerFormDialog = ({
  open,
  onOpenChange,
  trigger,
  popupId,
  popups,
  onSave,
}: TriggerFormDialogProps) => {
  const { register, handleSubmit, reset, watch, setValue } = useForm<TriggerFormData>({
    defaultValues: {
      popup_id: popupId || "",
      trigger_category: "action",
      trigger_type: "event_count",
      event_type: "click",
      event_name: "",
      event_count: 5,
      page_path: "",
      page_count: 3,
      time_seconds: 30,
      scroll_percent: 50,
      min_vehicles: 1,
      vehicle_status: "ativo",
      min_maintenance_amount: 500,
      maintenance_period_days: 30,
      min_fuel_records: 3,
      fuel_period_days: 30,
      priority: 0,
      max_displays: 3,
      cooldown_hours: 24,
      is_active: true,
    },
  });

  const triggerCategory = watch("trigger_category");
  const triggerType = watch("trigger_type");
  const isActive = watch("is_active");
  const selectedPopupId = watch("popup_id");

  useEffect(() => {
    if (trigger) {
      const conditions = trigger.conditions as unknown as Record<string, unknown>;
      reset({
        popup_id: trigger.popup_id,
        trigger_category: trigger.trigger_category || "action",
        trigger_type: trigger.trigger_type,
        event_type: (conditions.event_type as string) || "click",
        event_name: (conditions.event_name as string) || "",
        event_count: (conditions.count as number) || 5,
        page_path: (conditions.page_path as string) || "",
        page_count: (conditions.page_count as number) || 3,
        time_seconds: (conditions.time_seconds as number) || 30,
        scroll_percent: (conditions.depth_percent as number) || 50,
        min_vehicles: (conditions.min_vehicles as number) || 1,
        vehicle_status: (conditions.status as string) || "ativo",
        min_maintenance_amount: (conditions.min_amount as number) || 500,
        maintenance_period_days: (conditions.period_days as number) || 30,
        min_fuel_records: (conditions.min_records as number) || 3,
        fuel_period_days: (conditions.period_days as number) || 30,
        priority: trigger.priority,
        max_displays: trigger.max_displays,
        cooldown_hours: trigger.cooldown_hours,
        is_active: trigger.is_active,
      });
    } else {
      reset({
        popup_id: popupId || "",
        trigger_category: "action",
        trigger_type: "event_count",
        event_type: "click",
        event_name: "",
        event_count: 5,
        page_path: "",
        page_count: 3,
        time_seconds: 30,
        scroll_percent: 50,
        min_vehicles: 1,
        vehicle_status: "ativo",
        min_maintenance_amount: 500,
        maintenance_period_days: 30,
        min_fuel_records: 3,
        fuel_period_days: 30,
        priority: 0,
        max_displays: 3,
        cooldown_hours: 24,
        is_active: true,
      });
    }
  }, [trigger, popupId, reset]);

  // Reset trigger_type when category changes
  useEffect(() => {
    if (triggerCategory === "action" && !ACTION_TRIGGER_TYPES.find(t => t.value === triggerType)) {
      setValue("trigger_type", "event_count");
    } else if (triggerCategory === "profile" && !PROFILE_TRIGGER_TYPES.find(t => t.value === triggerType)) {
      setValue("trigger_type", "vehicle_count");
    }
  }, [triggerCategory, triggerType, setValue]);

  const buildConditions = (data: TriggerFormData): TriggerConditions => {
    switch (data.trigger_type) {
      case "event_count":
        return {
          event_type: data.event_type,
          event_name: data.event_name || undefined,
          count: data.event_count,
        };
      case "page_view":
        return {
          page_path: data.page_path || undefined,
          page_count: data.page_count,
        };
      case "time_on_page":
        return {
          page_path: data.page_path || undefined,
          time_seconds: data.time_seconds,
        };
      case "scroll_depth":
        return {
          page_path: data.page_path || undefined,
          depth_percent: data.scroll_percent,
        };
      case "vehicle_count":
        return {
          min_vehicles: data.min_vehicles,
          status: data.vehicle_status as "ativo" | "inativo" | "any",
        };
      case "maintenance_spent":
        return {
          min_amount: data.min_maintenance_amount,
          period_days: data.maintenance_period_days,
        };
      case "fuel_count":
        return {
          min_records: data.min_fuel_records,
          period_days: data.fuel_period_days,
        };
      default:
        return { event_type: "click", count: 1 };
    }
  };

  const onSubmit = (data: TriggerFormData) => {
    onSave({
      popup_id: data.popup_id,
      trigger_category: data.trigger_category,
      trigger_type: data.trigger_type as PopupTrigger["trigger_type"],
      conditions: buildConditions(data),
      priority: data.priority,
      max_displays: data.max_displays,
      cooldown_hours: data.cooldown_hours,
      is_active: data.is_active,
    });
  };

  const currentTriggerTypes = triggerCategory === "action" ? ACTION_TRIGGER_TYPES : PROFILE_TRIGGER_TYPES;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {trigger ? "Editar Gatilho" : "Novo Gatilho"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Popup Selection */}
          <div className="space-y-2">
            <Label>Popup</Label>
            <Select
              value={selectedPopupId}
              onValueChange={(value) => setValue("popup_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um popup" />
              </SelectTrigger>
              <SelectContent>
                {popups.map((popup) => (
                  <SelectItem key={popup.id} value={popup.id}>
                    {popup.title} ({popup.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Trigger Category */}
          <div className="space-y-2">
            <Label>Categoria do Gatilho</Label>
            <Select
              value={triggerCategory}
              onValueChange={(value: TriggerCategory) => setValue("trigger_category", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="action">
                  <div>
                    <span className="font-medium">Ação</span>
                    <span className="text-muted-foreground ml-2 text-xs">
                      - Baseado em comportamento (cliques, navegação)
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="profile">
                  <div>
                    <span className="font-medium">Perfil</span>
                    <span className="text-muted-foreground ml-2 text-xs">
                      - Baseado em dados do usuário (veículos, gastos)
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Trigger Type */}
          <div className="space-y-2">
            <Label>Tipo de Gatilho</Label>
            <Select
              value={triggerType}
              onValueChange={(value) => setValue("trigger_type", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentTriggerTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <span className="font-medium">{type.label}</span>
                      <span className="text-muted-foreground ml-2 text-xs">
                        - {type.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Condition Fields - Action Types */}
          {triggerCategory === "action" && (
            <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
              <Label className="text-sm font-medium">Condições</Label>
              
              {triggerType === "event_count" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="event_type" className="text-xs">Tipo de evento</Label>
                      <Select
                        value={watch("event_type")}
                        onValueChange={(value) => setValue("event_type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="click">Clique</SelectItem>
                          <SelectItem value="form_submit">Envio de formulário</SelectItem>
                          <SelectItem value="button_click">Clique em botão</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="event_count" className="text-xs">Quantidade mínima</Label>
                      <Input
                        id="event_count"
                        type="number"
                        min={1}
                        {...register("event_count", { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="event_name" className="text-xs">Nome do evento (opcional)</Label>
                    <Input
                      id="event_name"
                      placeholder="Ex: salvar_checklist"
                      {...register("event_name")}
                    />
                  </div>
                </div>
              )}

              {triggerType === "page_view" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="page_path" className="text-xs">Página (opcional)</Label>
                    <Input
                      id="page_path"
                      placeholder="/checklist"
                      {...register("page_path")}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="page_count" className="text-xs">Visualizações mínimas</Label>
                    <Input
                      id="page_count"
                      type="number"
                      min={1}
                      {...register("page_count", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              )}

              {triggerType === "time_on_page" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="page_path" className="text-xs">Página (opcional)</Label>
                    <Input
                      id="page_path"
                      placeholder="/checklist"
                      {...register("page_path")}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="time_seconds" className="text-xs">Tempo (segundos)</Label>
                    <Input
                      id="time_seconds"
                      type="number"
                      min={1}
                      {...register("time_seconds", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              )}

              {triggerType === "scroll_depth" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="page_path" className="text-xs">Página (opcional)</Label>
                    <Input
                      id="page_path"
                      placeholder="/checklist"
                      {...register("page_path")}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="scroll_percent" className="text-xs">Profundidade (%)</Label>
                    <Input
                      id="scroll_percent"
                      type="number"
                      min={1}
                      max={100}
                      {...register("scroll_percent", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Condition Fields - Profile Types */}
          {triggerCategory === "profile" && (
            <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
              <Label className="text-sm font-medium">Condições</Label>
              
              {triggerType === "vehicle_count" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="min_vehicles" className="text-xs">Mínimo de veículos</Label>
                    <Input
                      id="min_vehicles"
                      type="number"
                      min={1}
                      {...register("min_vehicles", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="vehicle_status" className="text-xs">Status</Label>
                    <Select
                      value={watch("vehicle_status")}
                      onValueChange={(value) => setValue("vehicle_status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativos</SelectItem>
                        <SelectItem value="inativo">Inativos</SelectItem>
                        <SelectItem value="any">Qualquer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {triggerType === "maintenance_spent" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="min_maintenance_amount" className="text-xs">Valor mínimo (R$)</Label>
                    <Input
                      id="min_maintenance_amount"
                      type="number"
                      min={0}
                      {...register("min_maintenance_amount", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="maintenance_period_days" className="text-xs">Período (dias)</Label>
                    <Input
                      id="maintenance_period_days"
                      type="number"
                      min={1}
                      {...register("maintenance_period_days", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              )}

              {triggerType === "fuel_count" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="min_fuel_records" className="text-xs">Mínimo de abastecimentos</Label>
                    <Input
                      id="min_fuel_records"
                      type="number"
                      min={1}
                      {...register("min_fuel_records", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="fuel_period_days" className="text-xs">Período (dias)</Label>
                    <Input
                      id="fuel_period_days"
                      type="number"
                      min={1}
                      {...register("fuel_period_days", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Display Settings */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Input
                id="priority"
                type="number"
                {...register("priority", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_displays">Max Exibições</Label>
              <Input
                id="max_displays"
                type="number"
                {...register("max_displays", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cooldown_hours">Cooldown (h)</Label>
              <Input
                id="cooldown_hours"
                type="number"
                {...register("cooldown_hours", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={(checked) => setValue("is_active", checked)}
            />
            <Label htmlFor="is_active">Gatilho ativo</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {trigger ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
