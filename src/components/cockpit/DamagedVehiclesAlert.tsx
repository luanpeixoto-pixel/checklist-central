import { AlertTriangle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import type { ChecklistData } from "@/types/checklist";
import type { Vehicle } from "@/types/fleet";

interface DamagedVehiclesAlertProps {
  checklists: ChecklistData[];
  vehicles: Vehicle[];
}

export const DamagedVehiclesAlert = ({ checklists, vehicles }: DamagedVehiclesAlertProps) => {
  // Get the latest checklist per vehicle
  const latestByVehicle = new Map<string, ChecklistData>();
  for (const c of checklists) {
    if (!c.vehicle_id) continue;
    const existing = latestByVehicle.get(c.vehicle_id);
    if (!existing || new Date(c.data) > new Date(existing.data)) {
      latestByVehicle.set(c.vehicle_id, c);
    }
  }

  // Find vehicles with damage markers or bad conditions
  const damaged: { vehicle: Vehicle; issues: string[] }[] = [];
  latestByVehicle.forEach((checklist, vehicleId) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle || vehicle.status === "inativo") return;

    const issues: string[] = [];
    const conditions = Object.entries(checklist.vehicleCondition);
    for (const [key, val] of conditions) {
      if (val === "bad") {
        const labels: Record<string, string> = {
          limpezaExterna: "Limpeza externa",
          limpezaInterna: "Limpeza interna",
          pneus: "Pneus",
          estepe: "Estepe",
        };
        issues.push(labels[key] || key);
      }
    }
    if (checklist.areaMarkers.length > 0) {
      issues.push(`${checklist.areaMarkers.length} avaria(s) registrada(s)`);
    }

    if (issues.length > 0) {
      damaged.push({ vehicle, issues });
    }
  });

  if (damaged.length === 0) return null;

  return (
    <Card className="border-destructive/30 bg-destructive/5 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h3 className="font-semibold text-foreground">
            Veículos que precisam de manutenção
          </h3>
        </div>
        <div className="space-y-2">
          {damaged.map(({ vehicle, issues }) => (
            <Link
              key={vehicle.id}
              to={`/veiculos/${vehicle.id}`}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-destructive/10 transition-colors group"
            >
              <div>
                <span className="font-medium text-foreground">
                  {vehicle.placa} — {vehicle.modelo}
                </span>
                <p className="text-xs text-muted-foreground">{issues.join(" · ")}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
