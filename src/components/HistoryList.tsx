import { 
  Car, 
  Calendar, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  ChevronRight,
  FileText,
  Trash2,
} from "lucide-react";
import type { ChecklistData } from "@/types/checklist";
import type { Vehicle } from "@/types/fleet";
import { cn } from "@/lib/utils";

interface HistoryListProps {
  checklists: ChecklistData[];
  vehicles: Vehicle[];
  onSelect: (checklist: ChecklistData) => void;
  onDelete: (id: string) => void;
}

const getOverallStatus = (checklist: ChecklistData): 'good' | 'warning' | 'critical' => {
  const conditions = Object.values(checklist.vehicleCondition);
  const hasBad = conditions.includes('bad');
  const hasMedium = conditions.includes('medium');
  
  if (hasBad || checklist.areaMarkers.length > 2) return 'critical';
  if (hasMedium || checklist.areaMarkers.length > 0) return 'warning';
  return 'good';
};

const statusConfig = {
  good: {
    icon: CheckCircle2,
    label: 'Bom estado',
    className: 'bg-success/10 text-success border-success/20',
    iconClassName: 'text-success',
  },
  warning: {
    icon: AlertTriangle,
    label: 'Atenção',
    className: 'bg-warning/10 text-warning border-warning/20',
    iconClassName: 'text-warning',
  },
  critical: {
    icon: XCircle,
    label: 'Crítico',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
    iconClassName: 'text-destructive',
  },
};

export const HistoryList = ({ checklists, vehicles, onSelect, onDelete }: HistoryListProps) => {
  const vehicleMap = new Map(vehicles.map((v) => [v.id, v]));

  if (checklists.length === 0) {
    return (
      <div className="card-elevated p-12 text-center animate-fade-in">
        <div className="inline-flex p-4 rounded-full bg-muted mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Nenhum checklist registrado
        </h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Crie seu primeiro checklist de inspeção veicular para começar a manter o histórico.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {checklists.map((checklist, index) => {
          const status = getOverallStatus(checklist);
          const config = statusConfig[status];
          const StatusIcon = config.icon;
          const vehicle = vehicleMap.get(checklist.vehicle_id);

          return (
            <div
              key={checklist.id || index}
              className="card-elevated p-4 hover:shadow-elevated-lg transition-all duration-200 cursor-pointer group animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => onSelect(checklist)}
            >
              <div className="flex items-start gap-4">
                {/* Status indicator */}
                <div className={cn(
                  "p-3 rounded-xl border",
                  config.className
                )}>
                  <StatusIcon className={cn("h-6 w-6", config.iconClassName)} />
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground truncate">
                        {vehicle ? vehicle.modelo : "Veículo não encontrado"}
                      </h3>
                      <p className="text-sm text-primary font-medium">
                        {vehicle ? vehicle.placa : "-"}
                      </p>
                    </div>
                    <span className={cn(
                      "shrink-0 px-3 py-1 rounded-full text-xs font-medium border",
                      config.className
                    )}>
                      {config.label}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      <span>{checklist.nome}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(checklist.data).toLocaleDateString('pt-BR')}</span>
                    </div>
                    {checklist.quilometragem && (
                      <div className="flex items-center gap-1.5">
                        <Car className="h-4 w-4" />
                        <span>{checklist.quilometragem} km</span>
                      </div>
                    )}
                  </div>

                  {checklist.areaMarkers.length > 0 && (
                    <p className="mt-2 text-xs text-warning">
                      {checklist.areaMarkers.length} área(s) afetada(s) marcada(s)
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (checklist.id) onDelete(checklist.id);
                    }}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
