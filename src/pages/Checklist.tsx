import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { ChecklistForm } from "@/components/ChecklistForm";
import { HistoryList } from "@/components/HistoryList";
import { LimitReachedDialog } from "@/components/LimitReachedDialog";
import { useChecklists } from "@/hooks/useChecklists";
import type { ChecklistData } from "@/types/checklist";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Checklist = () => {
  const [currentView, setCurrentView] = useState<'checklist' | 'history'>('history');
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

  const handleNewChecklist = () => {
    if (!canAddChecklist()) {
      setLimitReached(true);
      return;
    }
    setEditingChecklist(undefined);
    setCurrentView('checklist');
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
              onNew={handleNewChecklist}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Checklist;
