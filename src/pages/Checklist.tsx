import { useState, useMemo } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { ChecklistForm } from "@/components/ChecklistForm";
import { HistoryList } from "@/components/HistoryList";
import { EmptyState } from "@/components/EmptyState";
import { useChecklists } from "@/hooks/useChecklists";
import { useVehicles } from "@/hooks/useVehicles";
import { useMaintenance } from "@/hooks/useMaintenance";
import type { ChecklistData } from "@/types/checklist";
import { toast } from "sonner";
import { Loader2, Plus, Download, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { exportChecklistsToCSV } from "@/lib/exportChecklist";
import { DamagedVehiclesAlert } from "@/components/cockpit/DamagedVehiclesAlert";

type StatusFilter = "all" | "good" | "warning" | "critical";

const getOverallStatus = (checklist: ChecklistData): "good" | "warning" | "critical" => {
  const conditions = Object.values(checklist.vehicleCondition);
  const hasBad = conditions.includes("bad");
  const hasMedium = conditions.includes("medium");
  if (hasBad || checklist.areaMarkers.length > 2) return "critical";
  if (hasMedium || checklist.areaMarkers.length > 0) return "warning";
  return "good";
};

const Checklist = () => {
  const [currentView, setCurrentView] = useState<"form" | "history">("history");
  const [editingChecklist, setEditingChecklist] = useState<ChecklistData | undefined>();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [vehicleFilter, setVehicleFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const { checklists, loading: checklistsLoading, addChecklist, updateChecklist, deleteChecklist } = useChecklists();
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const { records: maintenanceRecords } = useMaintenance();
  const loading = checklistsLoading || vehiclesLoading;

  const filteredChecklists = useMemo(() => {
    return checklists.filter((c) => {
      if (statusFilter !== "all" && getOverallStatus(c) !== statusFilter) return false;
      if (vehicleFilter !== "all" && c.vehicle_id !== vehicleFilter) return false;
      if (dateFrom) {
        const d = new Date(c.data);
        if (d < dateFrom) return false;
      }
      if (dateTo) {
        const d = new Date(c.data);
        const end = new Date(dateTo);
        end.setHours(23, 59, 59);
        if (d > end) return false;
      }
      return true;
    });
  }, [checklists, statusFilter, vehicleFilter, dateFrom, dateTo]);

  const hasActiveFilters = statusFilter !== "all" || vehicleFilter !== "all" || dateFrom || dateTo;

  const clearFilters = () => {
    setStatusFilter("all");
    setVehicleFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const handleSubmit = async (data: ChecklistData) => {
    if (editingChecklist) {
      const success = await updateChecklist(editingChecklist.id!, data);
      if (success) {
        setEditingChecklist(undefined);
        setCurrentView("history");
        toast.success("Checklist atualizado com sucesso!");
      }
      return;
    }
    const success = await addChecklist(data);
    if (success) {
      setCurrentView("history");
      toast.success("Checklist salvo com sucesso!");
    }
  };

  const handleNewChecklist = () => { setEditingChecklist(undefined); setCurrentView("form"); };
  const handleEditChecklist = (checklist: ChecklistData) => { setEditingChecklist(checklist); setCurrentView("form"); };
  const handleDeleteChecklist = async (id: string) => { await deleteChecklist(id); };

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

  if (vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto px-4 py-12">
          <EmptyState variant="no-vehicles" toolName="checklist" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {currentView === "form" ? (editingChecklist ? "Editar Checklist" : "Novo Checklist de Inspeção") : "Checklist de Inspeção"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {currentView === "form"
                  ? "Selecione um veículo e preencha as informações da inspeção"
                  : `${filteredChecklists.length} registro${filteredChecklists.length !== 1 ? "s" : ""}${hasActiveFilters ? ` (filtrado de ${checklists.length})` : ""}`}
              </p>
            </div>
            {currentView === "history" && (
              <div className="flex gap-2">
                {checklists.length > 0 && (
                  <Button variant="outline" onClick={() => exportChecklistsToCSV(checklists, vehicles)} className="gap-2">
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                )}
                <Button data-track="click_new_checklist" onClick={handleNewChecklist} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Checklist
                </Button>
              </div>
            )}
          </div>

          {currentView === "history" && checklists.length > 0 && (
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

              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos status</SelectItem>
                  <SelectItem value="good">Bom</SelectItem>
                  <SelectItem value="warning">Atenção</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
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

          {currentView === "form" ? (
            <div className="animate-fade-in">
              <ChecklistForm vehicles={vehicles} initialData={editingChecklist} onSubmit={handleSubmit} key={editingChecklist?.id || "new"} />
            </div>
          ) : (
            <>
              <DamagedVehiclesAlert checklists={checklists} vehicles={vehicles} maintenanceRecords={maintenanceRecords} />
              <HistoryList checklists={filteredChecklists} vehicles={vehicles} onSelect={handleEditChecklist} onDelete={handleDeleteChecklist} />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Checklist;
