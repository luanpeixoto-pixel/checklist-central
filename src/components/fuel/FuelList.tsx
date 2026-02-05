import { Fuel, Edit2, Trash2, MoreVertical, Calendar, DollarSign, Gauge } from "lucide-react";
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
import { FUEL_TYPE_OPTIONS, type FuelRecord } from "@/types/fleet";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FuelListProps {
  records: FuelRecord[];
  onEdit: (record: FuelRecord) => void;
  onDelete: (id: string) => void;
}

export const FuelList = ({ records, onEdit, onDelete }: FuelListProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getFuelTypeName = (tipo: string) => {
    return FUEL_TYPE_OPTIONS.find(o => o.value === tipo)?.label || tipo;
  };

  if (records.length === 0) {
    return (
      <Card className="card-elevated">
        <CardContent className="py-12 text-center">
          <div className="inline-flex p-4 rounded-full bg-muted mb-4">
            <Fuel className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum abastecimento registrado</h3>
          <p className="text-muted-foreground">
            Clique em "Novo Abastecimento" para adicionar o primeiro registro.
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
                <div className="p-2 rounded-lg bg-success/10 mt-1">
                  <Fuel className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {record.vehicle && (
                      <h3 className="font-semibold text-foreground">
                        {record.vehicle.placa} - {record.vehicle.modelo}
                      </h3>
                    )}
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                      {getFuelTypeName(record.tipo_combustivel)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm flex-wrap mt-2">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(record.data_abastecimento), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </span>
                    <span className="flex items-center gap-1 text-primary font-medium">
                      <DollarSign className="h-4 w-4" />
                      {formatCurrency(Number(record.valor_total))}
                    </span>
                    <span className="text-muted-foreground">
                      {Number(record.litros).toFixed(2)}L
                    </span>
                    {record.valor_litro && (
                      <span className="text-muted-foreground">
                        R$ {Number(record.valor_litro).toFixed(3)}/L
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm flex-wrap mt-2">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Gauge className="h-4 w-4" />
                      {record.quilometragem.toLocaleString('pt-BR')} km
                    </span>
                    {record.km_por_litro && (
                      <span className="text-success font-medium">
                        {Number(record.km_por_litro).toFixed(1)} km/L
                      </span>
                    )}
                    {record.tanque_cheio && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">Tanque cheio</span>
                    )}
                  </div>

                  {record.posto && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {record.posto}
                      {record.condutor && ` • ${record.condutor}`}
                    </p>
                  )}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(record)} data-track="edit_abastecimento">
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
                          data-track="delete_abastecimento"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
