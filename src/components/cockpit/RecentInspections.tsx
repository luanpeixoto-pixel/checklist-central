import { ClipboardCheck, AlertTriangle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ChecklistData } from "@/types/checklist";
import type { Vehicle } from "@/types/fleet";

interface RecentInspectionsProps {
  checklists: ChecklistData[];
  vehicles: Vehicle[];
}

export const RecentInspections = ({ checklists, vehicles }: RecentInspectionsProps) => {
  return (
    <Card className="card-elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              Inspeções Recentes
            </CardTitle>
            <CardDescription>Últimas vistorias realizadas</CardDescription>
          </div>
          <Link to="/checklist" className="text-xs text-primary hover:underline flex items-center gap-1">
            Ver todas <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {checklists.length > 0 ? (
            checklists.slice(0, 5).map((checklist, index) => {
              const vehicle = vehicles.find((v) => v.id === checklist.vehicle_id);
              const areasAfetadas = checklist.areaMarkers?.length || 0;

              const conditions = checklist.vehicleCondition;
              const hasBad =
                conditions &&
                (conditions.limpezaExterna === "bad" ||
                  conditions.limpezaInterna === "bad" ||
                  conditions.pneus === "bad" ||
                  conditions.estepe === "bad");
              const hasMedium =
                conditions &&
                (conditions.limpezaExterna === "medium" ||
                  conditions.limpezaInterna === "medium" ||
                  conditions.pneus === "medium" ||
                  conditions.estepe === "medium");

              let statusVariant: "default" | "destructive" | "secondary" = "default";
              let statusLabel = "Bom";

              if (hasBad || areasAfetadas > 2) {
                statusVariant = "destructive";
                statusLabel = "Ruim";
              } else if (hasMedium || areasAfetadas > 0) {
                statusVariant = "secondary";
                statusLabel = "Regular";
              }

              return (
                <div
                  key={checklist.id || index}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {vehicle?.placa || "Sem placa"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(checklist.data).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {areasAfetadas > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <AlertTriangle className="h-3 w-3" />
                        {areasAfetadas}
                      </div>
                    )}
                    <Badge variant={statusVariant}>{statusLabel}</Badge>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma inspeção registrada
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
