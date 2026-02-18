import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePopupAdmin } from "@/hooks/usePopupAdmin";
import { PopupList } from "@/components/admin/popup/PopupList";
import { PopupFormDialog } from "@/components/admin/popup/PopupFormDialog";
import { TriggerList } from "@/components/admin/popup/TriggerList";
import { TriggerFormDialog } from "@/components/admin/popup/TriggerFormDialog";
import type { PopupDefinition, PopupTrigger } from "@/types/popup";

const PopupAdmin = () => {
  const {
    popups,
    triggers,
    loading,
    createPopup,
    updatePopup,
    deletePopup,
    createTrigger,
    updateTrigger,
    deleteTrigger,
  } = usePopupAdmin();

  const [popupDialogOpen, setPopupDialogOpen] = useState(false);
  const [triggerDialogOpen, setTriggerDialogOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<PopupDefinition | null>(null);
  const [editingTrigger, setEditingTrigger] = useState<PopupTrigger | null>(null);
  const [selectedPopupId, setSelectedPopupId] = useState<string | null>(null);

  const handleCreatePopup = () => {
    setEditingPopup(null);
    setPopupDialogOpen(true);
  };

  const handleEditPopup = (popup: PopupDefinition) => {
    setEditingPopup(popup);
    setPopupDialogOpen(true);
  };

  const handleSavePopup = async (data: Omit<PopupDefinition, "id" | "created_at" | "updated_at">) => {
    try {
      if (editingPopup) {
        await updatePopup(editingPopup.id, data);
      } else {
        await createPopup(data);
      }
      setPopupDialogOpen(false);
      setEditingPopup(null);
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error saving popup:", error);
    }
  };

  const handleDeletePopup = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este popup?")) {
      await deletePopup(id);
    }
  };

  const handleCreateTrigger = (popupId: string) => {
    setSelectedPopupId(popupId);
    setEditingTrigger(null);
    setTriggerDialogOpen(true);
  };

  const handleEditTrigger = (trigger: PopupTrigger) => {
    setSelectedPopupId(trigger.popup_id);
    setEditingTrigger(trigger);
    setTriggerDialogOpen(true);
  };

  const handleSaveTrigger = async (data: Omit<PopupTrigger, "id" | "created_at">) => {
    try {
      if (editingTrigger) {
        await updateTrigger(editingTrigger.id, data);
      } else {
        await createTrigger(data);
      }
      setTriggerDialogOpen(false);
      setEditingTrigger(null);
      setSelectedPopupId(null);
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error saving trigger:", error);
    }
  };

  const handleDeleteTrigger = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este gatilho?")) {
      await deleteTrigger(id);
    }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Gerenciador de Popups
          </h1>
          <p className="text-muted-foreground">
            Configure popups e gatilhos de exibição
          </p>
        </div>

        <Tabs defaultValue="popups" className="space-y-6">
          <TabsList>
            <TabsTrigger value="popups">Popups ({popups.length})</TabsTrigger>
            <TabsTrigger value="triggers">Gatilhos ({triggers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="popups" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={handleCreatePopup}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Popup
              </Button>
            </div>
            <PopupList
              popups={popups}
              triggers={triggers}
              onEdit={handleEditPopup}
              onDelete={handleDeletePopup}
              onAddTrigger={handleCreateTrigger}
            />
          </TabsContent>

          <TabsContent value="triggers" className="space-y-4">
            <TriggerList
              triggers={triggers}
              popups={popups}
              onEdit={handleEditTrigger}
              onDelete={handleDeleteTrigger}
            />
          </TabsContent>
        </Tabs>
      </main>

      <PopupFormDialog
        open={popupDialogOpen}
        onOpenChange={setPopupDialogOpen}
        popup={editingPopup}
        onSave={handleSavePopup}
      />

      <TriggerFormDialog
        open={triggerDialogOpen}
        onOpenChange={setTriggerDialogOpen}
        trigger={editingTrigger}
        popupId={selectedPopupId}
        popups={popups}
        onSave={handleSaveTrigger}
      />
    </div>
  );
};

export default PopupAdmin;
