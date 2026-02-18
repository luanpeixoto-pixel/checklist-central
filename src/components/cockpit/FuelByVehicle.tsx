import { Fuel, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { FuelRecord, Vehicle } from "@/types/fleet";

interface FuelByVehicleProps {
  records: FuelRecord[];
  vehicles: Vehicle[];
  formatCurrency: (value: number) => string;
}

interface VehicleFuelSummary {
  vehicle: Vehicle;
  totalCost: number;
  totalLiters: number;
  avgKmPerLiter: number;
}

export const FuelByVehicle = ({ records, vehicles, formatCurrency }: FuelByVehicleProps) => {
  const summaryMap = new Map<string, VehicleFuelSummary>();

  for (const r of records) {
    const vehicle = vehicles.find((v) => v.id === r.vehicle_id);
    if (!vehicle) continue;

    const existing = summaryMap.get(r.vehicle_id);
    if (existing) {
      existing.totalCost += Number(r.valor_total || 0);
      existing.totalLiters += Number(r.litros || 0);
    } else {
      summaryMap.set(r.vehicle_id, {
        vehicle,
        totalCost: Number(r.valor_total || 0),
        totalLiters: Number(r.litros || 0),
        avgKmPerLiter: 0,
      });
    }
  }

  // Calculate avg km/L per vehicle
  for (const [vehicleId, summary] of summaryMap) {
    const vehicleRecords = records.filter(
      (r) => r.vehicle_id === vehicleId && r.km_por_litro
    );
    if (vehicleRecords.length > 0) {
      summary.avgKmPerLiter =
        vehicleRecords.reduce((sum, r) => sum + Number(r.km_por_litro || 0), 0) /
        vehicleRecords.length;
    }
  }

  const sorted = Array.from(summaryMap.values()).sort((a, b) => b.totalCost - a.totalCost);

  return (
    <Card className="card-elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5 text-success" />
              Consumo por Veículo
            </CardTitle>
            <CardDescription>Custo e km/L por veículo</CardDescription>
          </div>
          <Link to="/combustivel" className="text-xs text-primary hover:underline flex items-center gap-1">
            Ver todos <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sorted.length > 0 ? (
            sorted.slice(0, 5).map((s) => (
              <div
                key={s.vehicle.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {s.vehicle.placa}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {s.vehicle.modelo}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-foreground">
                      {s.avgKmPerLiter > 0 ? `${s.avgKmPerLiter.toFixed(1)} km/L` : "—"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatCurrency(s.totalCost)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum abastecimento registrado
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
