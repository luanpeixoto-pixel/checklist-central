import { useState } from "react";
import { Link } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { ChecklistForm } from "@/components/ChecklistForm";
import { HistoryList } from "@/components/HistoryList";
import { LimitReachedDialog } from "@/components/LimitReachedDialog";
import { useChecklists } from "@/hooks/useChecklists";
import { useVehicles } from "@/hooks/useVehicles";
import type { ChecklistData } from "@/types/checklist";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Checklist = () => {
  const [currentView, setCurrentView] = useState<"form" | "history">("history");
  const [editingChecklist, setEditingChecklist] = useState<ChecklistData | undefined>();

  // Checklist data
  const {
    checklists,
    loading: checklistsLoading,
    limitReached,
    setLimitReached,
    canAddChecklist,
    addChecklist,
    updateChecklist,
    deleteChecklist,
    remainingChecklists,
  } = useChecklists();

  // Vehicles (DEPENDÊNCIA EXPLÍCITA)
  const { vehicles, loading: vehiclesLoading } = useVehicles();

  const loading = checklistsLoading || vehiclesLoading;

  /* -----------------------------
   * Handlers
   * ----------------------------- */

  const handleSubmit = async (data: ChecklistData) => {
    if (editingChecklist) {
      const success = await updateChecklist(editingChecklist.id!, data);
      if (success) {
        setEditingChecklist(undefined);
        setCurrentView("history");
        toast.success("Checklist atualizado com sucesso!");
      }
    } else {
      if (!canAddChecklist()) {
        setLimitReached(true);
        return;
      }

      const success = await addChecklist(data);
      if (success) {
        setCurrentView("history");
        toast.success("Checklist salvo com sucesso!");
      }
    }
  };

  const handleNewChecklist = () => {
    if (!canAddChecklist()) {
      setLimitReached(true);
      return;
    }
    setEditingChecklist(undefined);
    setCurrentView("form");
  };

  const handleEditChecklist = (checklist: ChecklistData) => {
    setEditingChecklist(checklist);
    setCurrentView("form");
  };

  const handleDeleteChecklist = async (id: string) => {
    await deleteChecklist(id);
  };

  /* -----------------------------
   * Loading state
   * ----------------------------- */

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

  /* -----------------------------
   * Empty state — no vehicles
   * ----------------------------- */

  if (vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Nenhum veículo cadastrado</h1>
            <p className="text-muted-foreground">
              Para criar um checklist de inspeção, você precisa cadastrar pelo menos um veículo primeiro.
            </p>
            <Button asChild className="mt-4">
              <Link to="/veiculos">Cadastrar veículo</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  /* -----------------------------
   * Main render
   * ----------------------------- */

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <LimitReachedDialog open={limitReached} onClose={() => setLimitReached(false)} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {currentView === "form"
                  ? editingChecklist
                    ? "Editar Checklist"
                    : "Novo Checklist de Inspeção"
                  : "Checklist de Inspeção"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {currentView === "form"
                  ? "Selecione um veículo e preencha as informações da inspeção"
                  : `${checklists.length} registro${
                      checklists.length !== 1 ? "s" : ""
                    } • ${remainingChecklists} restantes`}
              </p>
            </div>

            {currentView === "history" && (
              <Button onClick={handleNewChecklist} className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Checklist
              </Button>
            )}
          </div>

          {/* Content */}
          {currentView === "form" ? (
            <div className="animate-fade-in">
              <ChecklistForm
                vehicles={vehicles}
                initialData={editingChecklist}
                onSubmit={handleSubmit}
                key={editingChecklist?.id || "new"}
              />
            </div>
          ) : (
            <HistoryList checklists={checklists} onSelect={handleEditChecklist} onDelete={handleDeleteChecklist} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Checklist;
