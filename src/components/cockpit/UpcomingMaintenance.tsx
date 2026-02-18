import { Calendar, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MaintenanceRecord, Vehicle } from "@/types/fleet";

interface UpcomingMaintenanceProps {
  records: MaintenanceRecord[];
  vehicles: Vehicle[];
}

export const UpcomingMaintenance = ({ records, vehicles }: UpcomingMaintenanceProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = records
    .filter((r) => r.status === "agendada" && r.data_proxima)
    .map((r) => {
      const vehicle = vehicles.find((v) => v.id === r.vehicle_id);
      const dueDate = new Date(r.data_proxima!);
      const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return { ...r, vehicle, dueDate, diffDays };
    })
    .sort((a, b) => a.diffDays - b.diffDays)
    .slice(0, 5);

  return (
    <Card className="card-elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Próximas Manutenções
            </CardTitle>
            <CardDescription>Agendamentos futuros</CardDescription>
          </div>
          <Link to="/manutencao" className="text-xs text-primary hover:underline flex items-center gap-1">
            Ver todas <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcoming.length > 0 ? (
            upcoming.map((item) => {
              let urgencyVariant: "default" | "destructive" | "secondary" = "default";
              let urgencyLabel = "";

              if (item.diffDays < 0) {
                urgencyVariant = "destructive";
                urgencyLabel = `${Math.abs(item.diffDays)}d atrasado`;
              } else if (item.diffDays <= 7) {
                urgencyVariant = "destructive";
                urgencyLabel = item.diffDays === 0 ? "Hoje" : `${item.diffDays}d`;
              } else if (item.diffDays <= 30) {
                urgencyVariant = "secondary";
                urgencyLabel = `${item.diffDays}d`;
              } else {
                urgencyLabel = `${item.diffDays}d`;
              }

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{item.item}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.vehicle?.placa || "—"} · {item.dueDate.toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <Badge variant={urgencyVariant}>{urgencyLabel}</Badge>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma manutenção agendada
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
