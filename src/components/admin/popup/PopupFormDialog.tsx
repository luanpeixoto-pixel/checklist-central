import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
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
import type { PopupDefinition, PopupType, DropdownOption } from "@/types/popup";

interface PopupFormData {
  name: string;
  title: string;
  popup_type: PopupType;
  message: string;
  cta_text: string;
  redirect_url: string;
  is_active: boolean;
}

interface PopupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  popup: PopupDefinition | null;
  onSave: (data: Omit<PopupDefinition, "id" | "created_at" | "updated_at">) => void;
}

const POPUP_TYPES: { value: PopupType; label: string; description: string }[] = [
  { value: "submit", label: "Input (Coletar informação)", description: "Campo de texto para o usuário digitar" },
  { value: "dropdown", label: "Dropdown (Perguntas e respostas)", description: "Opções pré-definidas para seleção" },
  { value: "redirect", label: "Redirect (Redirecionar)", description: "Botão que leva a uma URL" },
];

export const PopupFormDialog = ({ open, onOpenChange, popup, onSave }: PopupFormDialogProps) => {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<PopupFormData>({
    defaultValues: {
      name: "",
      title: "",
      popup_type: "submit",
      message: "",
      cta_text: "Enviar",
      redirect_url: "",
      is_active: true,
    },
  });

  const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>([]);
  const [submitPlaceholder, setSubmitPlaceholder] = useState("Digite aqui...");

  const popupType = watch("popup_type");
  const isActive = watch("is_active");

  useEffect(() => {
    if (popup) {
      reset({
        name: popup.name,
        title: popup.title,
        popup_type: popup.popup_type || "submit",
        message: popup.message || popup.description || "",
        cta_text: popup.cta_text || popup.form_schema?.submitButtonText || "Enviar",
        redirect_url: popup.redirect_url || "",
        is_active: popup.is_active,
      });
      setDropdownOptions(popup.form_schema?.dropdownOptions || []);
      setSubmitPlaceholder(popup.form_schema?.fields?.[0]?.placeholder || "Digite aqui...");
    } else {
      reset({
        name: "",
        title: "",
        popup_type: "submit",
        message: "",
        cta_text: "Enviar",
        redirect_url: "",
        is_active: true,
      });
      setDropdownOptions([]);
      setSubmitPlaceholder("Digite aqui...");
    }
  }, [popup, reset]);

  const addDropdownOption = () => {
    setDropdownOptions([
      ...dropdownOptions,
      { id: crypto.randomUUID(), question: "", answers: [""] },
    ]);
  };

  const updateDropdownQuestion = (id: string, question: string) => {
    setDropdownOptions(dropdownOptions.map(opt => 
      opt.id === id ? { ...opt, question } : opt
    ));
  };

  const updateDropdownAnswer = (optionId: string, answerIndex: number, value: string) => {
    setDropdownOptions(dropdownOptions.map(opt => {
      if (opt.id === optionId) {
        const newAnswers = [...opt.answers];
        newAnswers[answerIndex] = value;
        return { ...opt, answers: newAnswers };
      }
      return opt;
    }));
  };

  const addAnswer = (optionId: string) => {
    setDropdownOptions(dropdownOptions.map(opt => {
      if (opt.id === optionId) {
        return { ...opt, answers: [...opt.answers, ""] };
      }
      return opt;
    }));
  };

  const removeAnswer = (optionId: string, answerIndex: number) => {
    setDropdownOptions(dropdownOptions.map(opt => {
      if (opt.id === optionId && opt.answers.length > 1) {
        return { ...opt, answers: opt.answers.filter((_, i) => i !== answerIndex) };
      }
      return opt;
    }));
  };

  const removeDropdownOption = (id: string) => {
    setDropdownOptions(dropdownOptions.filter(opt => opt.id !== id));
  };

  const onSubmit = (data: PopupFormData) => {
    const formSchema = {
      submitButtonText: data.cta_text,
      ...(data.popup_type === "submit" && {
        fields: [{
          id: "user_input",
          type: "textarea" as const,
          label: "Resposta",
          placeholder: submitPlaceholder,
          required: true,
        }],
      }),
      ...(data.popup_type === "dropdown" && {
        dropdownOptions: dropdownOptions.filter(opt => opt.question.trim()),
      }),
    };

    onSave({
      name: data.name,
      title: data.title,
      popup_type: data.popup_type,
      message: data.message,
      cta_text: data.cta_text,
      redirect_url: data.popup_type === "redirect" ? data.redirect_url : undefined,
      description: data.message,
      is_active: data.is_active,
      form_schema: formSchema,
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome (identificador interno)</Label>
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
              <Label htmlFor="title">Título do Popup</Label>
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

          {/* Popup Type */}
          <div className="space-y-2">
            <Label>Tipo do Popup</Label>
            <Select
              value={popupType}
              onValueChange={(value: PopupType) => setValue("popup_type", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POPUP_TYPES.map((type) => (
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

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              placeholder="Texto que aparece no corpo do popup..."
              rows={3}
              {...register("message")}
            />
          </div>

          {/* Type-specific fields */}
          {popupType === "submit" && (
            <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
              <Label htmlFor="placeholder">Placeholder do campo de texto</Label>
              <Input
                id="placeholder"
                value={submitPlaceholder}
                onChange={(e) => setSubmitPlaceholder(e.target.value)}
                placeholder="Digite sua resposta..."
              />
            </div>
          )}

          {popupType === "dropdown" && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center justify-between">
                <Label>Perguntas e Respostas</Label>
                <Button type="button" variant="outline" size="sm" onClick={addDropdownOption}>
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Pergunta
                </Button>
              </div>
              
              {dropdownOptions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma pergunta adicionada. Clique em "Adicionar Pergunta" para começar.
                </p>
              )}

              {dropdownOptions.map((option, optionIndex) => (
                <div key={option.id} className="space-y-3 p-3 border rounded bg-background">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Pergunta {optionIndex + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-auto"
                      onClick={() => removeDropdownOption(option.id)}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                  <Input
                    value={option.question}
                    onChange={(e) => updateDropdownQuestion(option.id, e.target.value)}
                    placeholder="Digite a pergunta..."
                  />
                  <div className="space-y-2 pl-4">
                    <Label className="text-xs text-muted-foreground">Opções de resposta:</Label>
                    {option.answers.map((answer, answerIndex) => (
                      <div key={answerIndex} className="flex items-center gap-2">
                        <Input
                          value={answer}
                          onChange={(e) => updateDropdownAnswer(option.id, answerIndex, e.target.value)}
                          placeholder={`Opção ${answerIndex + 1}`}
                          className="h-8 text-sm"
                        />
                        {option.answers.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeAnswer(option.id, answerIndex)}
                          >
                            <Trash2 className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => addAnswer(option.id)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Adicionar opção
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {popupType === "redirect" && (
            <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
              <Label htmlFor="redirect_url">URL de Redirecionamento</Label>
              <Input
                id="redirect_url"
                type="url"
                placeholder="https://exemplo.com/pagina"
                {...register("redirect_url")}
              />
              <p className="text-xs text-muted-foreground">
                URL para onde o usuário será redirecionado ao clicar no botão
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="space-y-2">
            <Label htmlFor="cta_text">Texto do Botão (CTA)</Label>
            <Input
              id="cta_text"
              placeholder="Enviar"
              {...register("cta_text", { required: "Texto do botão é obrigatório" })}
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-2">
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={(checked) => setValue("is_active", checked)}
            />
            <Label htmlFor="is_active">Popup ativo</Label>
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
