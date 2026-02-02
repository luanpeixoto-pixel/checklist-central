import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface LimitReachedDialogProps {
  open: boolean;
  onClose: () => void;
}

export const LimitReachedDialog = ({ open, onClose }: LimitReachedDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl">
              Limite Atingido
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base pt-4">
            Você atingiu o limite de <strong>10 inspeções</strong> cadastradas.
            <br /><br />
            Para cadastrar uma nova inspeção, você precisa excluir uma inspeção existente no histórico.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose} className="w-full">
            Entendi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
