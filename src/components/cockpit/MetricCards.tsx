import { Link } from "react-router-dom";
import { Car, Fuel, Wrench, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardsProps {
  totalVehicles: number;
  activeVehicles: number;
  fuelCost: number;
  maintenanceCost: number;
  avgKmPerLiter: number;
  formatCurrency: (value: number) => string;
}

export const MetricCards = ({
  totalVehicles,
  activeVehicles,
  fuelCost,
  maintenanceCost,
  avgKmPerLiter,
  formatCurrency,
}: MetricCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Link to="/veiculos">
        <Card className="card-elevated hover:shadow-lg transition-all duration-200 cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Veículos</p>
                <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {totalVehicles}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activeVehicles} ativos
                </p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <Car className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link to="/combustivel">
        <Card className="card-elevated hover:shadow-lg transition-all duration-200 cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gasto com Combustível</p>
                <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {formatCurrency(fuelCost)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Total acumulado</p>
              </div>
              <div className="p-3 rounded-full bg-success/10">
                <Fuel className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link to="/manutencao">
        <Card className="card-elevated hover:shadow-lg transition-all duration-200 cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gasto com Manutenção</p>
                <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {formatCurrency(maintenanceCost)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Total acumulado</p>
              </div>
              <div className="p-3 rounded-full bg-accent/10">
                <Wrench className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link to="/combustivel">
        <Card className="card-elevated hover:shadow-lg transition-all duration-200 cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Média km/L</p>
                <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {avgKmPerLiter > 0 ? avgKmPerLiter.toFixed(1) : '-'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Consumo da frota</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};
