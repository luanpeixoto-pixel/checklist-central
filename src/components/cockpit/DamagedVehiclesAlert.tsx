import { useState, useMemo } from "react";
import { AlertTriangle, ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import type { ChecklistData } from "@/types/checklist";
import type { Vehicle, MaintenanceRecord } from "@/types/fleet";

interface DamagedVehiclesAlertProps {
  checklists: ChecklistData[];
  vehicles: Vehicle[];
  maintenanceRecords: MaintenanceRecord[];
}

export const DamagedVehiclesAlert = ({ checklists, vehicles, maintenanceRecords }: DamagedVehiclesAlertProps) => {
  const [dismissed, setDismissed] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("dismissed_vehicle_alerts");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const damaged = useMemo(() => {
    // Get the latest checklist per vehicle
    const latestByVehicle = new Map<string, ChecklistData>();
    for (const c of checklists) {
      if (!c.vehicle_id) continue;
      const existing = latestByVehicle.get(c.vehicle_id);
      if (!existing || new Date(c.data) > new Date(existing.data)) {
        latestByVehicle.set(c.vehicle_id, c);
      }
    }

    const result: { vehicle: Vehicle; issues: string[]; checklistDate: string }[] = [];

    latestByVehicle.forEach((checklist, vehicleId) => {
      const vehicle = vehicles.find((v) => v.id === vehicleId);
      if (!vehicle || vehicle.status === "inativo") return;

      const issues: string[] = [];
      const conditions = Object.entries(checklist.vehicleCondition);
      for (const [key, val] of conditions) {
        if (val === "bad" || val === "medium") {
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

      if (issues.length === 0) return;

      // Check if there's a maintenance (scheduled or done) AFTER the inspection date
      const inspectionDate = new Date(checklist.data);
      const hasMaintenanceAfter = maintenanceRecords.some(
        (m) =>
          m.vehicle_id === vehicleId &&
          (new Date(m.data_manutencao) >= inspectionDate ||
            (m.data_proxima && new Date(m.data_proxima) >= inspectionDate))
      );

      if (!hasMaintenanceAfter) {
        result.push({ vehicle, issues, checklistDate: checklist.data });
      }
    });

    return result;
  }, [checklists, vehicles, maintenanceRecords]);

  const handleDismiss = (vehicleId: string) => {
    const next = new Set(dismissed);
    next.add(vehicleId);
    setDismissed(next);
    try {
      localStorage.setItem("dismissed_vehicle_alerts", JSON.stringify([...next]));
    } catch {}
  };

  const visible = damaged.filter((d) => !dismissed.has(d.vehicle.id));

  if (visible.length === 0) return null;

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
          {visible.map(({ vehicle, issues }) => (
            <div
              key={vehicle.id}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-destructive/10 transition-colors group"
            >
              <Link
                to={`/veiculos/${vehicle.id}`}
                className="flex-1 min-w-0"
              >
                <span className="font-medium text-foreground">
                  {vehicle.placa} — {vehicle.modelo}
                </span>
                <p className="text-xs text-muted-foreground">{issues.join(" · ")}</p>
              </Link>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDismiss(vehicle.id)}
                  className="p-1 rounded-md hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                  title="Ignorar alerta"
                >
                  <X className="h-4 w-4" />
                </button>
                <Link to={`/veiculos/${vehicle.id}`}>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
