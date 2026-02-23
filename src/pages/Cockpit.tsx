import { AppHeader } from "@/components/layout/AppHeader";
import { OnboardingPopup } from "@/components/OnboardingPopup";
import { useVehicles } from "@/hooks/useVehicles";
import { useMaintenance } from "@/hooks/useMaintenance";
import { useFuel } from "@/hooks/useFuel";
import { useChecklists } from "@/hooks/useChecklists";
import { Loader2 } from "lucide-react";
import { MetricCards } from "@/components/cockpit/MetricCards";
import { ModulesGrid } from "@/components/cockpit/ModulesGrid";
import { TopMaintenance } from "@/components/cockpit/TopMaintenance";
import { UpcomingMaintenance } from "@/components/cockpit/UpcomingMaintenance";
import { RecentInspections } from "@/components/cockpit/RecentInspections";
import { FuelByVehicle } from "@/components/cockpit/FuelByVehicle";
import { HomeSlider } from "@/components/cockpit/HomeSlider";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const Cockpit = () => {
  const { vehicles, activeVehicles, loading: vehiclesLoading } = useVehicles();
  const { records: maintenanceRecords, totalCost: maintenanceCost, topMaintenanceItems, loading: maintenanceLoading } = useMaintenance();
  const { records: fuelRecords, totalCost: fuelCost, avgKmPerLiter, loading: fuelLoading } = useFuel();
  const { checklists, loading: checklistsLoading } = useChecklists();

  const loading = vehiclesLoading || maintenanceLoading || fuelLoading || checklistsLoading;

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
      <OnboardingPopup />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Painel de Controle</h1>
          <p className="text-muted-foreground">Gerencie sua frota de veículos de forma integrada</p>
        </div>

        <HomeSlider />

        <MetricCards
          totalVehicles={vehicles.length}
          activeVehicles={activeVehicles.length}
          fuelCost={fuelCost}
          maintenanceCost={maintenanceCost}
          avgKmPerLiter={avgKmPerLiter}
          formatCurrency={formatCurrency}
        />

        <ModulesGrid />

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">Informações Importantes</h2>
          <p className="text-sm text-muted-foreground">Resumo e alertas da sua frota</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TopMaintenance topItems={topMaintenanceItems} formatCurrency={formatCurrency} />
          <UpcomingMaintenance records={maintenanceRecords} vehicles={vehicles} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FuelByVehicle records={fuelRecords} vehicles={vehicles} formatCurrency={formatCurrency} />
          <RecentInspections checklists={checklists} vehicles={vehicles} />
        </div>
      </main>

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
