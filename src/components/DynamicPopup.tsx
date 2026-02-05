import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star } from "lucide-react";
import type { PopupDefinition, FormField } from "@/types/popup";
import type { Json } from "@/integrations/supabase/types";

interface DynamicPopupProps {
  popup: PopupDefinition;
  onSubmit: (data: Record<string, Json>) => void;
  onDismiss: () => void;
}

export const DynamicPopup = ({ popup, onSubmit, onDismiss }: DynamicPopupProps) => {
  const [formData, setFormData] = useState<Record<string, Json>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (fieldId: string, value: Json) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const fields = popup.form_schema?.fields ?? [];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach((field) => {
      if (field.required) {
        const value = formData[field.id];
        if (value === undefined || value === null || value === "") {
          newErrors[field.id] = "Este campo é obrigatório";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={(formData[field.id] as string) || ""}
            onChange={(e) => updateField(field.id, e.target.value)}
            min={field.min}
            max={field.max}
          />
        );

      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            value={(formData[field.id] as string) || ""}
            onChange={(e) => updateField(field.id, e.target.value)}
            rows={4}
          />
        );

      case "select":
        return (
          <Select
            value={(formData[field.id] as string) || ""}
            onValueChange={(value) => updateField(field.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "Selecione..."} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "radio":
        return (
          <RadioGroup
            value={(formData[field.id] as string) || ""}
            onValueChange={(value) => updateField(field.id, value)}
          >
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => {
              const selectedOptions = (formData[field.id] as string[]) || [];
              return (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${option}`}
                    checked={selectedOptions.includes(option)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateField(field.id, [...selectedOptions, option]);
                      } else {
                        updateField(
                          field.id,
                          selectedOptions.filter((o) => o !== option)
                        );
                      }
                    }}
                  />
                  <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                </div>
              );
            })}
          </div>
        );

      case "rating":
        const maxRating = field.max || 5;
        const currentRating = (formData[field.id] as number) || 0;
        return (
          <div className="flex gap-1">
            {Array.from({ length: maxRating }, (_, i) => i + 1).map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => updateField(field.id, rating)}
                className="p-1 transition-colors"
              >
                <Star
                  className={`h-6 w-6 ${
                    rating <= currentRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onDismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{popup.title}</DialogTitle>
          {popup.description && (
            <DialogDescription>{popup.description}</DialogDescription>
          )}
        </DialogHeader>

        {fields.length > 0 && (
          <div className="space-y-4 py-4">
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                {renderField(field)}
                {errors[field.id] && (
                  <p className="text-sm text-destructive">{errors[field.id]}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onDismiss}>
            Agora não
          </Button>
          <Button onClick={handleSubmit}>
            {popup.form_schema?.submitButtonText || "Enviar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
