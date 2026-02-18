import { useParams, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { useVehicles } from "@/hooks/useVehicles";
import { useMaintenance } from "@/hooks/useMaintenance";
import { useFuel } from "@/hooks/useFuel";
import { useChecklists } from "@/hooks/useChecklists";
import { Loader2, ArrowLeft, Car, Wrench, Fuel, ClipboardCheck, Calendar, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VEHICLE_TYPE_OPTIONS, FUEL_TYPE_OPTIONS, MAINTENANCE_GROUP_OPTIONS } from "@/types/fleet";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const formatDate = (dateStr: string) => {
  try {
    return format(new Date(dateStr), "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return dateStr;
  }
};

const VehicleProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const { records: maintenanceRecords, loading: maintenanceLoading } = useMaintenance();
  const { records: fuelRecords, loading: fuelLoading } = useFuel();
  const { checklists, loading: checklistsLoading } = useChecklists();

  const loading = vehiclesLoading || maintenanceLoading || fuelLoading || checklistsLoading;
  const vehicle = vehicles.find((v) => v.id === id);

  const vehicleMaintenance = maintenanceRecords.filter((r) => r.vehicle_id === id);
  const vehicleFuel = fuelRecords.filter((r) => r.vehicle_id === id);
  const vehicleChecklists = checklists.filter((c) => c.vehicle_id === id);

  const totalMaintenanceCost = vehicleMaintenance.reduce((sum, r) => sum + Number(r.custo || 0), 0);
  const totalFuelCost = vehicleFuel.reduce((sum, r) => sum + Number(r.valor_total || 0), 0);
  const avgKmL = vehicleFuel.filter((r) => r.km_por_litro).reduce((sum, r, _, arr) => sum + Number(r.km_por_litro || 0) / arr.length, 0);

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

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto px-4 py-12 text-center">
          <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Veículo não encontrado</h2>
          <Button variant="outline" onClick={() => navigate("/veiculos")} className="gap-2 mt-4">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
        </main>
      </div>
    );
  }

  const getTypeName = (tipo: string) => VEHICLE_TYPE_OPTIONS.find((o) => o.value === tipo)?.label || tipo;
  const getFuelTypeName = (tipo: string) => FUEL_TYPE_OPTIONS.find((o) => o.value === tipo)?.label || tipo;
  const getGroupName = (grupo: string) => MAINTENANCE_GROUP_OPTIONS.find((o) => o.value === grupo)?.label || grupo;

  const statusConfig: Record<string, { label: string; className: string }> = {
    ativo: { label: "Ativo", className: "bg-success/15 text-success" },
    inativo: { label: "Inativo", className: "bg-muted text-muted-foreground" },
    em_manutencao: { label: "Em Manutenção", className: "bg-warning/15 text-warning" },
  };
  const status = statusConfig[vehicle.status] || statusConfig.ativo;

  const maintenanceStatusConfig: Record<string, { label: string; className: string }> = {
    realizada: { label: "Realizada", className: "bg-success/15 text-success" },
    agendada: { label: "Agendada", className: "bg-primary/15 text-primary" },
    pendente: { label: "Pendente", className: "bg-warning/15 text-warning" },
  };

  const getChecklistStatus = (checklist: typeof checklists[0]) => {
    const conditions = checklist.vehicleCondition;
    const hasBad = Object.values(conditions).some((v) => v === "bad");
    const hasMedium = Object.values(conditions).some((v) => v === "medium");
    if (hasBad || checklist.areaMarkers.length > 2) return { label: "Crítico", className: "bg-destructive/15 text-destructive" };
    if (hasMedium || checklist.areaMarkers.length > 0) return { label: "Atenção", className: "bg-warning/15 text-warning" };
    return { label: "Bom", className: "bg-success/15 text-success" };
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate("/veiculos")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{vehicle.placa}</h1>
                <p className="text-muted-foreground">{vehicle.marca} {vehicle.modelo} {vehicle.ano && `• ${vehicle.ano}`}</p>
              </div>
            </div>
            <Badge className={cn("ml-auto", status.className)}>{status.label}</Badge>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <MapPin className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{vehicle.quilometragem_atual.toLocaleString("pt-BR")} km</p>
                <p className="text-xs text-muted-foreground">Odômetro</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Wrench className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{formatCurrency(totalMaintenanceCost)}</p>
                <p className="text-xs text-muted-foreground">{vehicleMaintenance.length} manutenções</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Fuel className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{formatCurrency(totalFuelCost)}</p>
                <p className="text-xs text-muted-foreground">{vehicleFuel.length} abastecimentos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{avgKmL > 0 ? `${avgKmL.toFixed(1)} km/L` : "—"}</p>
                <p className="text-xs text-muted-foreground">Consumo médio</p>
              </CardContent>
            </Card>
          </div>

          {/* Vehicle Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Dados Técnicos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Tipo</span>
                  <p className="font-medium text-foreground">{getTypeName(vehicle.tipo)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Marca</span>
                  <p className="font-medium text-foreground">{vehicle.marca || "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Cor</span>
                  <p className="font-medium text-foreground">{vehicle.cor || "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Empresa</span>
                  <p className="font-medium text-foreground">{vehicle.empresa || "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="maintenance">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="maintenance" className="gap-1">
                <Wrench className="h-4 w-4" /> Manutenção ({vehicleMaintenance.length})
              </TabsTrigger>
              <TabsTrigger value="fuel" className="gap-1">
                <Fuel className="h-4 w-4" /> Combustível ({vehicleFuel.length})
              </TabsTrigger>
              <TabsTrigger value="checklists" className="gap-1">
                <ClipboardCheck className="h-4 w-4" /> Inspeções ({vehicleChecklists.length})
              </TabsTrigger>
            </TabsList>

            {/* Maintenance Tab */}
            <TabsContent value="maintenance" className="mt-4 space-y-3">
              {vehicleMaintenance.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Nenhuma manutenção registrada para este veículo.
                  </CardContent>
                </Card>
              ) : (
                vehicleMaintenance.map((r) => (
                  <Card key={r.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">{r.item}</p>
                          <p className="text-sm text-muted-foreground">
                            {r.grupo && `${getGroupName(r.grupo)} • `}
                            {r.tipo_manutencao === "preventiva" ? "Preventiva" : "Corretiva"}
                          </p>
                          {r.descricao && <p className="text-sm text-muted-foreground mt-1">{r.descricao}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">{formatCurrency(Number(r.custo || 0))}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                            <Calendar className="h-3 w-3" /> {formatDate(r.data_manutencao)}
                          </p>
                          <Badge className={cn("mt-1 text-xs", maintenanceStatusConfig[r.status]?.className)}>
                            {maintenanceStatusConfig[r.status]?.label || r.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Fuel Tab */}
            <TabsContent value="fuel" className="mt-4 space-y-3">
              {vehicleFuel.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Nenhum abastecimento registrado para este veículo.
                  </CardContent>
                </Card>
              ) : (
                vehicleFuel.map((r) => (
                  <Card key={r.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">{getFuelTypeName(r.tipo_combustivel)}</p>
                          <p className="text-sm text-muted-foreground">
                            {r.litros}L • {r.quilometragem.toLocaleString("pt-BR")} km
                          </p>
                          {r.posto && <p className="text-sm text-muted-foreground">{r.posto}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">{formatCurrency(Number(r.valor_total))}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                            <Calendar className="h-3 w-3" /> {formatDate(r.data_abastecimento)}
                          </p>
                          {r.km_por_litro && (
                            <p className="text-xs text-primary font-medium mt-1">{Number(r.km_por_litro).toFixed(1)} km/L</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Checklists Tab */}
            <TabsContent value="checklists" className="mt-4 space-y-3">
              {vehicleChecklists.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Nenhuma inspeção registrada para este veículo.
                  </CardContent>
                </Card>
              ) : (
                vehicleChecklists.map((c) => {
                  const st = getChecklistStatus(c);
                  return (
                    <Card key={c.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-foreground">Inspeção — {c.nome}</p>
                            <p className="text-sm text-muted-foreground">
                              {c.quilometragem && `${Number(c.quilometragem).toLocaleString("pt-BR")} km`}
                              {c.areaMarkers.length > 0 && ` • ${c.areaMarkers.length} avaria${c.areaMarkers.length > 1 ? "s" : ""}`}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={cn("text-xs", st.className)}>{st.label}</Badge>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-1">
                              <Calendar className="h-3 w-3" /> {formatDate(c.data)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default VehicleProfile;
