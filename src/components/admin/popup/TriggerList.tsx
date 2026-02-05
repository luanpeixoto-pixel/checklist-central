import { Edit, Trash2, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PopupDefinition, PopupTrigger, TriggerConditions } from "@/types/popup";

interface TriggerListProps {
  triggers: PopupTrigger[];
  popups: PopupDefinition[];
  onEdit: (trigger: PopupTrigger) => void;
  onDelete: (id: string) => void;
}

const TRIGGER_TYPE_LABELS: Record<string, string> = {
  event_count: "Contagem de Eventos",
  page_view: "Visualização de Página",
  time_on_page: "Tempo na Página",
  scroll_depth: "Profundidade de Scroll",
};

const formatConditions = (type: string, conditions: TriggerConditions): string => {
  switch (type) {
    case "event_count": {
      const c = conditions as { event_type: string; event_name?: string; count: number };
      return `${c.event_type}${c.event_name ? ` (${c.event_name})` : ""} ≥ ${c.count}`;
    }
    case "page_view": {
      const c = conditions as { page_path?: string; page_count: number };
      return `${c.page_path || "qualquer página"} ≥ ${c.page_count} visualizações`;
    }
    case "time_on_page": {
      const c = conditions as { page_path?: string; time_seconds: number };
      return `${c.page_path || "qualquer página"} ≥ ${c.time_seconds}s`;
    }
    case "scroll_depth": {
      const c = conditions as { page_path?: string; depth_percent: number };
      return `${c.page_path || "qualquer página"} ≥ ${c.depth_percent}%`;
    }
    default:
      return JSON.stringify(conditions);
  }
};

export const TriggerList = ({ triggers, popups, onEdit, onDelete }: TriggerListProps) => {
  const getPopupName = (popupId: string) => {
    const popup = popups.find((p) => p.id === popupId);
    return popup?.title || popup?.name || "Popup desconhecido";
  };

  if (triggers.length === 0) {
    return (
      <Card className="card-elevated">
        <CardContent className="py-12 text-center">
          <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum gatilho cadastrado</p>
          <p className="text-sm text-muted-foreground mt-1">
            Adicione gatilhos a partir da lista de popups
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {triggers.map((trigger) => (
        <Card key={trigger.id} className="card-elevated">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{getPopupName(trigger.popup_id)}</span>
                  <Badge variant={trigger.is_active ? "default" : "secondary"}>
                    {trigger.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                  <Badge variant="outline">
                    Prioridade: {trigger.priority}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-normal">
                      {TRIGGER_TYPE_LABELS[trigger.trigger_type] || trigger.trigger_type}
                    </Badge>
                    <span>{formatConditions(trigger.trigger_type, trigger.conditions)}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span>Max exibições: {trigger.max_displays ?? "∞"}</span>
                    <span>Cooldown: {trigger.cooldown_hours ?? 24}h</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(trigger)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(trigger.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
