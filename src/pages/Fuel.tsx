import { useState, useMemo } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { FuelForm } from "@/components/fuel/FuelForm";
import { FuelList } from "@/components/fuel/FuelList";
import { EmptyState } from "@/components/EmptyState";
import { useFuel } from "@/hooks/useFuel";
import { useVehicles } from "@/hooks/useVehicles";
import { Loader2, Plus, Download, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { FuelRecord, FuelFormData, FUEL_TYPE_OPTIONS } from "@/types/fleet";
import { FUEL_TYPE_OPTIONS as fuelOptions } from "@/types/fleet";
import { exportFuelToCSV } from "@/lib/exportFuel";

const Fuel = () => {
  const { records, loading, addRecord, updateRecord, deleteRecord, totalCost, totalLiters, avgKmPerLiter } = useFuel();
  const { vehicles, activeVehicles, loading: vehiclesLoading } = useVehicles();
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FuelRecord | null>(null);
  const [vehicleFilter, setVehicleFilter] = useState<string>("all");
  const [fuelTypeFilter, setFuelTypeFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (vehicleFilter !== "all" && r.vehicle_id !== vehicleFilter) return false;
      if (fuelTypeFilter !== "all" && r.tipo_combustivel !== fuelTypeFilter) return false;
      if (dateFrom) {
        const d = new Date(r.data_abastecimento);
        if (d < dateFrom) return false;
      }
      if (dateTo) {
        const d = new Date(r.data_abastecimento);
        const end = new Date(dateTo);
        end.setHours(23, 59, 59);
        if (d > end) return false;
      }
      return true;
    });
  }, [records, vehicleFilter, fuelTypeFilter, dateFrom, dateTo]);

  const hasActiveFilters = vehicleFilter !== "all" || fuelTypeFilter !== "all" || dateFrom || dateTo;

  const clearFilters = () => {
    setVehicleFilter("all");
    setFuelTypeFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const handleSubmit = async (data: FuelFormData) => {
    if (editingRecord) {
      const success = await updateRecord(editingRecord.id, data);
      if (success) { setEditingRecord(null); setShowForm(false); }
    } else {
      const success = await addRecord(data);
      if (success) { setShowForm(false); }
    }
  };

  const handleEdit = (record: FuelRecord) => { setEditingRecord(record); setShowForm(true); };
  const handleCancel = () => { setEditingRecord(null); setShowForm(false); };

  const isLoading = loading || vehiclesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  if (vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto px-4 py-12">
          <EmptyState variant="no-vehicles" toolName="abastecimento" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {showForm ? (editingRecord ? "Editar Abastecimento" : "Novo Abastecimento") : "Controle de Combustível"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {showForm
                  ? "Preencha os dados do abastecimento"
                  : `${filteredRecords.length} registro${filteredRecords.length !== 1 ? "s" : ""}${hasActiveFilters ? ` (filtrado de ${records.length})` : ""} • Total: ${formatCurrency(totalCost)} • ${totalLiters.toFixed(1)}L`}
              </p>
            </div>
            {!showForm && (
              <div className="flex gap-2">
                {records.length > 0 && (
                  <Button variant="outline" onClick={() => exportFuelToCSV(records, vehicles)} className="gap-2">
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                )}
                <Button data-track="novo_abastecimento" onClick={() => setShowForm(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Abastecimento
                </Button>
              </div>
            )}
          </div>

          {!showForm && avgKmPerLiter > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">
                Média de consumo da frota: <span className="text-primary font-bold">{avgKmPerLiter.toFixed(1)} km/L</span>
              </p>
            </div>
          )}

          {!showForm && records.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-lg border border-border bg-card">
              <Filter className="h-4 w-4 text-muted-foreground" />

              <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder="Veículo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos veículos</SelectItem>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>{v.placa}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={fuelTypeFilter} onValueChange={setFuelTypeFilter}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder="Combustível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos tipos</SelectItem>
                  {fuelOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("h-9", dateFrom && "text-primary")}>
                    {dateFrom ? format(dateFrom, "dd/MM/yy") : "De"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} locale={ptBR} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("h-9", dateTo && "text-primary")}>
                    {dateTo ? format(dateTo, "dd/MM/yy") : "Até"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} locale={ptBR} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 gap-1 text-muted-foreground">
                  <X className="h-3 w-3" /> Limpar
                </Button>
              )}
            </div>
          )}

          {showForm ? (
            <FuelForm vehicles={activeVehicles} initialData={editingRecord} onSubmit={handleSubmit} onCancel={handleCancel} />
          ) : (
            <FuelList records={filteredRecords} onEdit={handleEdit} onDelete={deleteRecord} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Fuel;
