import { Car, Edit2, Trash2, MoreVertical } from "lucide-react";
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
import { VEHICLE_TYPE_OPTIONS, type Vehicle } from "@/types/fleet";
import { cn } from "@/lib/utils";

interface VehicleListProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

export const VehicleList = ({ vehicles, onEdit, onDelete }: VehicleListProps) => {
  const getTypeName = (tipo: string) => {
    return VEHICLE_TYPE_OPTIONS.find(o => o.value === tipo)?.label || tipo;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      ativo: { label: 'Ativo', className: 'bg-success/15 text-success' },
      inativo: { label: 'Inativo', className: 'bg-muted text-muted-foreground' },
      em_manutencao: { label: 'Em Manutenção', className: 'bg-warning/15 text-warning' },
    };
    const config = statusConfig[status] || statusConfig.ativo;
    return (
      <span className={cn("px-2 py-1 rounded-full text-xs font-medium", config.className)}>
        {config.label}
      </span>
    );
  };

  if (vehicles.length === 0) {
    return (
      <Card className="card-elevated">
        <CardContent className="py-12 text-center">
          <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhum veículo cadastrado</h3>
          <p className="text-muted-foreground">
            Clique em "Novo Veículo" para adicionar o primeiro veículo da frota.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id} className="card-elevated hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Car className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{vehicle.placa}</p>
                  <p className="text-sm text-muted-foreground">{vehicle.modelo}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(vehicle)} data-track="edit_veiculo">
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
                        <AlertDialogTitle>Excluir veículo?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Todos os registros de manutenção e abastecimento associados a este veículo também serão excluídos.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(vehicle.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          data-track="delete_veiculo"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo:</span>
                <span className="text-foreground">{getTypeName(vehicle.tipo)}</span>
              </div>
              {vehicle.marca && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Marca:</span>
                  <span className="text-foreground">{vehicle.marca}</span>
                </div>
              )}
              {vehicle.ano && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ano:</span>
                  <span className="text-foreground">{vehicle.ano}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Km:</span>
                <span className="text-foreground">{vehicle.quilometragem_atual.toLocaleString('pt-BR')} km</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
              {getStatusBadge(vehicle.status)}
              {vehicle.empresa && (
                <span className="text-xs text-muted-foreground">{vehicle.empresa}</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
