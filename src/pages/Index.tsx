import { useState } from "react";
import { Header } from "@/components/Header";
import { ChecklistForm } from "@/components/ChecklistForm";
import { HistoryList } from "@/components/HistoryList";
import { LimitReachedDialog } from "@/components/LimitReachedDialog";
import { useChecklists } from "@/hooks/useChecklists";
import type { ChecklistData } from "@/types/checklist";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [currentView, setCurrentView] = useState<'checklist' | 'history'>('checklist');
  const [editingChecklist, setEditingChecklist] = useState<ChecklistData | undefined>();
  
  const {
    checklists,
    loading,
    limitReached,
    setLimitReached,
    canAddChecklist,
    addChecklist,
    updateChecklist,
    deleteChecklist,
    remainingChecklists,
  } = useChecklists();

  const handleSubmit = async (data: ChecklistData) => {
    if (editingChecklist) {
      const success = await updateChecklist(editingChecklist.id!, data);
      if (success) {
        setEditingChecklist(undefined);
        setCurrentView('history');
        toast.success("Checklist atualizado com sucesso!");
      }
    } else {
      if (!canAddChecklist()) {
        setLimitReached(true);
        return;
      }
      const success = await addChecklist(data);
      if (success) {
        setCurrentView('history');
        toast.success("Checklist salvo com sucesso!");
      }
    }
  };

  const handleSelectChecklist = (checklist: ChecklistData) => {
    setEditingChecklist(checklist);
    setCurrentView('checklist');
  };

  const handleDeleteChecklist = async (id: string) => {
    await deleteChecklist(id);
  };

  const handleViewChange = (view: 'checklist' | 'history') => {
    if (view === 'checklist') {
      if (!editingChecklist && !canAddChecklist()) {
        setLimitReached(true);
        return;
      }
      setEditingChecklist(undefined);
    }
    setCurrentView(view);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentView={currentView} onViewChange={handleViewChange} />
      
      <LimitReachedDialog 
        open={limitReached} 
        onClose={() => setLimitReached(false)} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {currentView === 'checklist' ? (
            <div className="animate-fade-in">
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">
                    {editingChecklist ? 'Editar Checklist' : 'Novo Checklist de Inspeção'}
                  </h2>
                  {!editingChecklist && (
                    <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {remainingChecklists} restantes
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground mt-1">
                  {editingChecklist 
                    ? 'Atualize as informações do checklist selecionado'
                    : 'Preencha todos os campos para registrar a inspeção do veículo'
                  }
                </p>
              </div>
              <ChecklistForm 
                onSubmit={handleSubmit} 
                initialData={editingChecklist}
                key={editingChecklist?.id || 'new'}
              />
            </div>
          ) : (
            <HistoryList
              checklists={checklists}
              onSelect={handleSelectChecklist}
              onDelete={handleDeleteChecklist}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            VeiculoCheck © {new Date().getFullYear()} — Sistema de Inspeção Veicular
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
