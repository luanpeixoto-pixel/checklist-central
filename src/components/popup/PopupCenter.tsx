import { useEffect, useState } from "react";
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
import type { PopupWithTrigger } from "@/types/popup";

interface PopupCenterProps {
  popup: PopupWithTrigger | null;
  onDismiss: () => void;
  onClick: () => void;
  onInputSubmit: (value: string) => void;
}

export const PopupCenter = ({ popup, onDismiss, onClick, onInputSubmit }: PopupCenterProps) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue("");
  }, [popup?.popup.id]);

  if (!popup) return null;

  const { popup: def } = popup;
  const formSchema = def.form_schema || {};
  const hasInput = def.popup_type === "submit" && formSchema.fields?.length;

  return (
    <Dialog open={Boolean(popup)} onOpenChange={(open) => !open && onDismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{def.title}</DialogTitle>
          <DialogDescription>{def.description || def.message}</DialogDescription>
        </DialogHeader>

        {hasInput && formSchema.fields?.map((field) => (
          <div key={field.id} className="space-y-2">
            {field.type === "textarea" ? (
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={field.placeholder || field.label}
              />
            ) : (
              <Input
                type={field.type === "email" ? "email" : field.type === "number" ? "number" : "text"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={field.placeholder || field.label}
              />
            )}
          </div>
        ))}

        <DialogFooter className="gap-2 sm:justify-end">
          <Button variant="outline" onClick={onDismiss}>
            Fechar
          </Button>
          <Button
            onClick={() => {
              if (hasInput) {
                const firstField = formSchema.fields?.[0];
                if (firstField?.required && !inputValue.trim()) return;
                onInputSubmit(inputValue.trim());
                setInputValue("");
                return;
              }
              onClick();
            }}
          >
            {def.cta_text || "Continuar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
