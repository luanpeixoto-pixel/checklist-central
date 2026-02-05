import { Edit, Trash2, Plus, Bell, BellOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PopupDefinition, PopupTrigger } from "@/types/popup";

interface PopupListProps {
  popups: PopupDefinition[];
  triggers: PopupTrigger[];
  onEdit: (popup: PopupDefinition) => void;
  onDelete: (id: string) => void;
  onAddTrigger: (popupId: string) => void;
}

export const PopupList = ({ popups, triggers, onEdit, onDelete, onAddTrigger }: PopupListProps) => {
  const getTriggerCount = (popupId: string) => {
    return triggers.filter((t) => t.popup_id === popupId).length;
  };

  if (popups.length === 0) {
    return (
      <Card className="card-elevated">
        <CardContent className="py-12 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum popup cadastrado</p>
          <p className="text-sm text-muted-foreground mt-1">
            Clique em "Novo Popup" para criar o primeiro
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {popups.map((popup) => {
        const triggerCount = getTriggerCount(popup.id);
        
        return (
          <Card key={popup.id} className="card-elevated">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg">{popup.title}</CardTitle>
                    <Badge variant={popup.is_active ? "default" : "secondary"}>
                      {popup.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <CardDescription>
                    <span className="font-mono text-xs">{popup.name}</span>
                    {popup.description && (
                      <span className="block mt-1">{popup.description}</span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddTrigger(popup.id)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Gatilho
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(popup)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(popup.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  {triggerCount > 0 ? (
                    <Bell className="h-4 w-4" />
                  ) : (
                    <BellOff className="h-4 w-4" />
                  )}
                  <span>{triggerCount} gatilho(s)</span>
                </div>
                <div>
                  <span className="font-mono text-xs">
                    {popup.form_schema.fields?.length || 0} campo(s)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
