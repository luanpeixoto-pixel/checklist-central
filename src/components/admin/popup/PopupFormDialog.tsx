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
import type { PopupDefinition, FormSchema } from "@/types/popup";

interface PopupFormData {
  name: string;
  title: string;
  description: string;
  is_active: boolean;
  form_schema_json: string;
}

interface PopupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  popup: PopupDefinition | null;
  onSave: (data: Omit<PopupDefinition, "id" | "created_at" | "updated_at">) => void;
}

const DEFAULT_FORM_SCHEMA: FormSchema = {
  fields: [
    {
      id: "feedback",
      type: "textarea",
      label: "Seu feedback",
      placeholder: "Digite aqui...",
      required: true,
    },
  ],
  submitButtonText: "Enviar",
};

export const PopupFormDialog = ({ open, onOpenChange, popup, onSave }: PopupFormDialogProps) => {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<PopupFormData>({
    defaultValues: {
      name: "",
      title: "",
      description: "",
      is_active: true,
      form_schema_json: JSON.stringify(DEFAULT_FORM_SCHEMA, null, 2),
    },
  });

  const isActive = watch("is_active");

  useEffect(() => {
    if (popup) {
      reset({
        name: popup.name,
        title: popup.title,
        description: popup.description || "",
        is_active: popup.is_active,
        form_schema_json: JSON.stringify(popup.form_schema, null, 2),
      });
    } else {
      reset({
        name: "",
        title: "",
        description: "",
        is_active: true,
        form_schema_json: JSON.stringify(DEFAULT_FORM_SCHEMA, null, 2),
      });
    }
  }, [popup, reset]);

  const onSubmit = (data: PopupFormData) => {
    let form_schema: FormSchema;
    try {
      form_schema = JSON.parse(data.form_schema_json);
    } catch {
      alert("JSON do formulário inválido");
      return;
    }

    onSave({
      name: data.name,
      title: data.title,
      description: data.description || undefined,
      is_active: data.is_active,
      form_schema,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {popup ? "Editar Popup" : "Novo Popup"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome (identificador)</Label>
              <Input
                id="name"
                placeholder="nps_feedback"
                {...register("name", { required: "Nome é obrigatório" })}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Como está sua experiência?"
                {...register("title", { required: "Título é obrigatório" })}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Texto que aparece abaixo do título..."
              rows={2}
              {...register("description")}
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={(checked) => setValue("is_active", checked)}
            />
            <Label htmlFor="is_active">Popup ativo</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="form_schema_json">Schema do Formulário (JSON)</Label>
            <Textarea
              id="form_schema_json"
              placeholder="{}"
              rows={12}
              className="font-mono text-sm"
              {...register("form_schema_json", { required: "Schema é obrigatório" })}
            />
            <p className="text-xs text-muted-foreground">
              Defina campos do formulário usando o schema JSON. Tipos: text, textarea, select, radio, checkbox, rating, email, number
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {popup ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
