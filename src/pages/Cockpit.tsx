import { Link } from "react-router-dom";
import { 
  Car, 
  ClipboardCheck, 
  Wrench, 
  Fuel, 
  TrendingUp,
  DollarSign,
  Activity,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AppHeader } from "@/components/layout/AppHeader";
import { useVehicles } from "@/hooks/useVehicles";
import { useMaintenance } from "@/hooks/useMaintenance";
import { useFuel } from "@/hooks/useFuel";
import { Loader2 } from "lucide-react";

const Cockpit = () => {
  const { vehicles, activeVehicles, loading: vehiclesLoading } = useVehicles();
  const { totalCost: maintenanceCost, topMaintenanceItems, loading: maintenanceLoading } = useMaintenance();
  const { totalCost: fuelCost, avgKmPerLiter, loading: fuelLoading } = useFuel();

  const loading = vehiclesLoading || maintenanceLoading || fuelLoading;

  const modules = [
    {
      title: "Checklist de Inspeção",
      description: "Realizar vistorias e inspeções dos veículos da frota",
      icon: ClipboardCheck,
      href: "/checklist",
      color: "bg-primary",
      iconBgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Controle de Manutenção",
      description: "Registrar e acompanhar manutenções preventivas e corretivas",
      icon: Wrench,
      href: "/manutencao",
      color: "bg-accent",
      iconBgColor: "bg-accent/10",
      iconColor: "text-accent",
    },
    {
      title: "Controle de Combustível",
      description: "Registrar abastecimentos e monitorar consumo",
      icon: Fuel,
      href: "/combustivel",
      color: "bg-success",
      iconBgColor: "bg-success/10",
      iconColor: "text-success",
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Painel de Controle
          </h1>
          <p className="text-muted-foreground">
            Gerencie sua frota de veículos de forma integrada
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Veículos</p>
                  <p className="text-3xl font-bold text-foreground">{vehicles.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeVehicles.length} ativos
                  </p>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <Car className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Gasto com Combustível</p>
                  <p className="text-3xl font-bold text-foreground">
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

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Gasto com Manutenção</p>
                  <p className="text-3xl font-bold text-foreground">
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

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Média km/L</p>
                  <p className="text-3xl font-bold text-foreground">
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
        </div>

        {/* Modules Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Módulos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Link key={module.href} to={module.href}>
                  <Card className="card-elevated h-full hover:shadow-lg transition-all duration-200 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${module.color} text-white`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {module.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {module.description}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Top Maintenance Items */}
        {topMaintenanceItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Top 5 Manutenções (Volume)
                </CardTitle>
                <CardDescription>Itens mais frequentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topMaintenanceItems.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm text-foreground">{item.item}</span>
                      <span className="text-sm font-medium text-primary">{item.count}x</span>
                    </div>
                  ))}
                  {topMaintenanceItems.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhuma manutenção registrada
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-accent" />
                  Top 5 Manutenções (Custo)
                </CardTitle>
                <CardDescription>Itens mais caros</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...topMaintenanceItems]
                    .sort((a, b) => b.cost - a.cost)
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <span className="text-sm text-foreground">{item.item}</span>
                        <span className="text-sm font-medium text-accent">{formatCurrency(item.cost)}</span>
                      </div>
                    ))}
                  {topMaintenanceItems.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhuma manutenção registrada
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            VeiculoCheck © {new Date().getFullYear()} — Sistema de Gestão de Frota
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Cockpit;
