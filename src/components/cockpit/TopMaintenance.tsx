import { Wrench, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface TopMaintenanceProps {
  topItems: { item: string; count: number; cost: number }[];
  formatCurrency: (value: number) => string;
}

export const TopMaintenance = ({ topItems, formatCurrency }: TopMaintenanceProps) => {
  const sorted = [...topItems]
    .sort((a, b) => (b.cost !== a.cost ? b.cost - a.cost : b.count - a.count))
    .slice(0, 5);

  return (
    <Card className="card-elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-accent" />
              Top Manutenções
            </CardTitle>
            <CardDescription>Por custo e frequência</CardDescription>
          </div>
          <Link to="/manutencao" className="text-xs text-primary hover:underline flex items-center gap-1">
            Ver todas <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sorted.length > 0 ? (
            sorted.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <span className="text-sm text-foreground">{item.item}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{item.count}x</span>
                  <span className="text-sm font-medium text-accent">
                    {formatCurrency(item.cost)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma manutenção registrada
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
