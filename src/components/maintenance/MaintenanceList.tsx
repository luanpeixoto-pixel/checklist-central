import { Wrench, Edit2, Trash2, MoreVertical, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { MaintenanceRecord } from "@/types/fleet";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MaintenanceListProps {
  records: MaintenanceRecord[];
  onEdit: (record: MaintenanceRecord) => void;
  onDelete: (id: string) => void;
}

export const MaintenanceList = ({ records, onEdit, onDelete }: MaintenanceListProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      realizada: { label: 'Realizada', className: 'bg-success/15 text-success' },
      agendada: { label: 'Agendada', className: 'bg-primary/15 text-primary' },
      pendente: { label: 'Pendente', className: 'bg-warning/15 text-warning' },
    };
    const config = statusConfig[status] || statusConfig.realizada;
    return (
      <span className={cn("px-2 py-1 rounded-full text-xs font-medium", config.className)}>
        {config.label}
      </span>
    );
  };

  const getTipoBadge = (tipo: string) => {
    return tipo === 'preventiva' 
      ? <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">Preventiva</span>
      : <span className="px-2 py-0.5 rounded text-xs font-medium bg-destructive/10 text-destructive">Corretiva</span>;
  };

  if (records.length === 0) {
    return (
      <Card className="card-elevated">
        <CardContent className="py-12 text-center">
          <div className="inline-flex p-4 rounded-full bg-muted mb-4">
            <Wrench className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma manutenção registrada</h3>
          <p className="text-muted-foreground">
            Clique em "Nova Manutenção" para adicionar o primeiro registro.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <Card key={record.id} className="card-elevated hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-2 rounded-lg bg-primary/10 mt-1">
                  <Wrench className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-foreground">{record.item}</h3>
                    {getTipoBadge(record.tipo_manutencao)}
                  </div>
                  
                  {record.vehicle && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {record.vehicle.placa} - {record.vehicle.modelo}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(record.data_manutencao), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                    <span className="flex items-center gap-1 text-primary font-medium">
                      <DollarSign className="h-4 w-4" />
                      {formatCurrency(Number(record.custo))}
                    </span>
                    {record.quilometragem_atual && (
                      <span className="text-muted-foreground">
                        {record.quilometragem_atual.toLocaleString('pt-BR')} km
                      </span>
                    )}
                  </div>

                  {record.descricao && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {record.descricao}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusBadge(record.status)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(record)} data-track="edit_manutencao">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir registro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(record.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          data-track="delete_manutencao"
                        >
                          Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
