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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PopupDefinition, PopupTrigger, TriggerConditions } from "@/types/popup";

interface TriggerFormData {
  popup_id: string;
  trigger_type: string;
  conditions_json: string;
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

const TRIGGER_TYPES = [
  { value: "event_count", label: "Contagem de Eventos" },
  { value: "page_view", label: "Visualização de Página" },
  { value: "time_on_page", label: "Tempo na Página" },
  { value: "scroll_depth", label: "Profundidade de Scroll" },
];

const DEFAULT_CONDITIONS: Record<string, TriggerConditions> = {
  event_count: { event_type: "click", count: 5 },
  page_view: { page_count: 3 },
  time_on_page: { time_seconds: 30 },
  scroll_depth: { depth_percent: 50 },
};

export const TriggerFormDialog = ({
  open,
  onOpenChange,
  trigger,
  popupId,
  popups,
  onSave,
}: TriggerFormDialogProps) => {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<TriggerFormData>({
    defaultValues: {
      popup_id: popupId || "",
      trigger_type: "event_count",
      conditions_json: JSON.stringify(DEFAULT_CONDITIONS.event_count, null, 2),
      priority: 0,
      max_displays: 3,
      cooldown_hours: 24,
      is_active: true,
    },
  });

  const triggerType = watch("trigger_type");
  const isActive = watch("is_active");
  const selectedPopupId = watch("popup_id");

  useEffect(() => {
    if (trigger) {
      reset({
        popup_id: trigger.popup_id,
        trigger_type: trigger.trigger_type,
        conditions_json: JSON.stringify(trigger.conditions, null, 2),
        priority: trigger.priority,
        max_displays: trigger.max_displays,
        cooldown_hours: trigger.cooldown_hours,
        is_active: trigger.is_active,
      });
    } else {
      reset({
        popup_id: popupId || "",
        trigger_type: "event_count",
        conditions_json: JSON.stringify(DEFAULT_CONDITIONS.event_count, null, 2),
        priority: 0,
        max_displays: 3,
        cooldown_hours: 24,
        is_active: true,
      });
    }
  }, [trigger, popupId, reset]);

  useEffect(() => {
    if (!trigger && triggerType) {
      setValue("conditions_json", JSON.stringify(DEFAULT_CONDITIONS[triggerType] || {}, null, 2));
    }
  }, [triggerType, trigger, setValue]);

  const onSubmit = (data: TriggerFormData) => {
    let conditions: TriggerConditions;
    try {
      conditions = JSON.parse(data.conditions_json);
    } catch {
      alert("JSON das condições inválido");
      return;
    }

    onSave({
      popup_id: data.popup_id,
      trigger_type: data.trigger_type as PopupTrigger["trigger_type"],
      conditions,
      priority: data.priority,
      max_displays: data.max_displays,
      cooldown_hours: data.cooldown_hours,
      is_active: data.is_active,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {trigger ? "Editar Gatilho" : "Novo Gatilho"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                {TRIGGER_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="conditions_json">Condições (JSON)</Label>
            <Textarea
              id="conditions_json"
              rows={6}
              className="font-mono text-sm"
              {...register("conditions_json", { required: "Condições são obrigatórias" })}
            />
            <p className="text-xs text-muted-foreground">
              {triggerType === "event_count" && "Campos: event_type, event_name (opcional), count"}
              {triggerType === "page_view" && "Campos: page_path (opcional), page_count"}
              {triggerType === "time_on_page" && "Campos: page_path (opcional), time_seconds"}
              {triggerType === "scroll_depth" && "Campos: page_path (opcional), depth_percent"}
            </p>
          </div>

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
