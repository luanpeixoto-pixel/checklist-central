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
import type { PopupRule } from "@/config/popupRules";

interface PopupCenterProps {
  popup: PopupRule | null;
  onDismiss: () => void;
  onClick: () => void;
  onInputSubmit: (value: string) => void;
}

export const PopupCenter = ({ popup, onDismiss, onClick, onInputSubmit }: PopupCenterProps) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue("");
  }, [popup?.id]);

  if (!popup) return null;

  const hasInput = Boolean(popup.input);

  return (
    <Dialog open={Boolean(popup)} onOpenChange={(open) => !open && onDismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{popup.title}</DialogTitle>
          <DialogDescription>{popup.description}</DialogDescription>
        </DialogHeader>

        {hasInput && (
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={popup.input?.placeholder}
          />
        )}

        <DialogFooter className="gap-2 sm:justify-end">
          <Button variant="outline" onClick={onDismiss}>
            {popup.dismissText || "Fechar"}
          </Button>
          <Button
            onClick={() => {
              if (hasInput) {
                if (popup.input?.required && !inputValue.trim()) return;
                onInputSubmit(inputValue.trim());
                setInputValue("");
                return;
              }
              onClick();
            }}
          >
            {popup.ctaText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
