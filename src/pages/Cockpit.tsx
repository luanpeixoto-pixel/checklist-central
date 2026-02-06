import { Link } from "react-router-dom";
import { Car, ClipboardCheck, Wrench, Fuel, TrendingUp, DollarSign, Activity, ChevronRight, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AppHeader } from "@/components/layout/AppHeader";
import { useVehicles } from "@/hooks/useVehicles";
import { useMaintenance } from "@/hooks/useMaintenance";
import { useFuel } from "@/hooks/useFuel";
import { useChecklists } from "@/hooks/useChecklists";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Cockpit = () => {
  const {
    vehicles,
    activeVehicles,
    loading: vehiclesLoading
  } = useVehicles();
  const {
    totalCost: maintenanceCost,
    topMaintenanceItems,
    loading: maintenanceLoading
  } = useMaintenance();
  const {
    totalCost: fuelCost,
    avgKmPerLiter,
    loading: fuelLoading
  } = useFuel();
  const {
    checklists,
    loading: checklistsLoading
  } = useChecklists();
  
  const loading = vehiclesLoading || maintenanceLoading || fuelLoading || checklistsLoading;
  const modules = [{
    title: "Checklist de Inspeção",
    description: "Realizar vistorias e inspeções dos veículos da frota",
    icon: ClipboardCheck,
    href: "/checklist",
    color: "bg-primary",
    iconBgColor: "bg-primary/10",
    iconColor: "text-primary"
  }, {
    title: "Controle de Manutenção",
    description: "Registrar e acompanhar manutenções preventivas e corretivas",
    icon: Wrench,
    href: "/manutencao",
    color: "bg-accent",
    iconBgColor: "bg-accent/10",
    iconColor: "text-accent"
  }, {
    title: "Controle de Combustível",
    description: "Registrar abastecimentos e monitorar consumo",
    icon: Fuel,
    href: "/combustivel",
    color: "bg-success",
    iconBgColor: "bg-success/10",
    iconColor: "text-success"
  }];
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  if (loading) {
    return <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
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
            {modules.map(module => {
            const Icon = module.icon;
            return <Link key={module.href} to={module.href}>
                  <Card className="card-elevated h-full hover:shadow-lg transition-all duration-200 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="">
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
                </Link>;
          })}
          </div>
        </div>

        {/* Data Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Manutenções Section - Ordenado por valor, depois volume */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-accent" />
                Manutenções
              </CardTitle>
              <CardDescription>Top 5 itens por custo e frequência</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topMaintenanceItems.length > 0 ? (
                  [...topMaintenanceItems]
                    .sort((a, b) => {
                      // Ordenar primeiro por custo (desc), depois por volume (desc)
                      if (b.cost !== a.cost) return b.cost - a.cost;
                      return b.count - a.count;
                    })
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <span className="text-sm text-foreground">{item.item}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">{item.count}x</span>
                          <span className="text-sm font-medium text-accent">{formatCurrency(item.cost)}</span>
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

          {/* Inspeções Section */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-primary" />
                Inspeções Recentes
              </CardTitle>
              <CardDescription>Últimas vistorias realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {checklists.length > 0 ? (
                  checklists.slice(0, 5).map((checklist, index) => {
                    const vehicle = vehicles.find(v => v.id === checklist.vehicle_id);
                    const areasAfetadas = checklist.areaMarkers?.length || 0;
                    
                    // Determinar status geral do veículo
                    const conditions = checklist.vehicleCondition;
                    const hasBad = conditions && (
                      conditions.limpezaExterna === 'bad' ||
                      conditions.limpezaInterna === 'bad' ||
                      conditions.pneus === 'bad' ||
                      conditions.estepe === 'bad'
                    );
                    const hasMedium = conditions && (
                      conditions.limpezaExterna === 'medium' ||
                      conditions.limpezaInterna === 'medium' ||
                      conditions.pneus === 'medium' ||
                      conditions.estepe === 'medium'
                    );
                    
                    let statusVariant: "default" | "destructive" | "outline" | "secondary" = "default";
                    let statusLabel = "Bom";
                    
                    if (hasBad || areasAfetadas > 2) {
                      statusVariant = "destructive";
                      statusLabel = "Ruim";
                    } else if (hasMedium || areasAfetadas > 0) {
                      statusVariant = "secondary";
                      statusLabel = "Regular";
                    }

                    return (
                      <div key={checklist.id || index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
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
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            VeiculoCheck © {new Date().getFullYear()} — Sistema de Gestão de Frota
          </p>
        </div>
      </footer>
    </div>;
};
export default Cockpit;