import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ChecklistForm } from "@/components/ChecklistForm";
import { HistoryList } from "@/components/HistoryList";
import type { ChecklistData } from "@/types/checklist";
import { toast } from "sonner";

const STORAGE_KEY = 'vehicle-checklists';

const Index = () => {
  const [currentView, setCurrentView] = useState<'checklist' | 'history'>('checklist');
  const [checklists, setChecklists] = useState<ChecklistData[]>([]);
  const [editingChecklist, setEditingChecklist] = useState<ChecklistData | undefined>();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setChecklists(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading checklists:', e);
      }
    }
  }, []);

  // Save to localStorage when checklists change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checklists));
  }, [checklists]);

  const handleSubmit = (data: ChecklistData) => {
    const newChecklist: ChecklistData = {
      ...data,
      id: data.id || `checklist-${Date.now()}`,
      createdAt: data.createdAt || new Date(),
    };

    if (editingChecklist) {
      setChecklists(prev => prev.map(c => c.id === editingChecklist.id ? newChecklist : c));
      setEditingChecklist(undefined);
    } else {
      setChecklists(prev => [newChecklist, ...prev]);
    }
    
    setCurrentView('history');
  };

  const handleSelectChecklist = (checklist: ChecklistData) => {
    setEditingChecklist(checklist);
    setCurrentView('checklist');
  };

  const handleDeleteChecklist = (id: string) => {
    setChecklists(prev => prev.filter(c => c.id !== id));
    toast.success("Checklist excluído com sucesso");
  };

  const handleViewChange = (view: 'checklist' | 'history') => {
    if (view === 'checklist') {
      setEditingChecklist(undefined);
    }
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentView={currentView} onViewChange={handleViewChange} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {currentView === 'checklist' ? (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground">
                  {editingChecklist ? 'Editar Checklist' : 'Novo Checklist de Inspeção'}
                </h2>
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
