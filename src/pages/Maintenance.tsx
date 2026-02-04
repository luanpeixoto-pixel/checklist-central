import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { MaintenanceForm } from "@/components/maintenance/MaintenanceForm";
import { MaintenanceList } from "@/components/maintenance/MaintenanceList";
import { useMaintenance } from "@/hooks/useMaintenance";
import { useVehicles } from "@/hooks/useVehicles";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MaintenanceRecord, MaintenanceFormData } from "@/types/fleet";

const Maintenance = () => {
  const { records, loading, addRecord, updateRecord, deleteRecord, totalCost } = useMaintenance();
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);

  const handleSubmit = async (data: MaintenanceFormData) => {
    if (editingRecord) {
      const success = await updateRecord(editingRecord.id, data);
      if (success) {
        setEditingRecord(null);
        setShowForm(false);
      }
    } else {
      const success = await addRecord(data);
      if (success) {
        setShowForm(false);
      }
    }
  };

  const handleEdit = (record: MaintenanceRecord) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingRecord(null);
    setShowForm(false);
  };

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {showForm ? (editingRecord ? 'Editar Manutenção' : 'Nova Manutenção') : 'Controle de Manutenção'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {showForm 
                  ? 'Preencha os dados da manutenção'
                  : `${records.length} registro${records.length !== 1 ? 's' : ''} • Total: ${formatCurrency(totalCost)}`
                }
              </p>
            </div>
            {!showForm && (
              <Button 
                onClick={() => setShowForm(true)} 
                className="gap-2"
                disabled={vehicles.length === 0}
              >
                <Plus className="h-4 w-4" />
                Nova Manutenção
              </Button>
            )}
          </div>

          {/* Alert for no vehicles */}
          {vehicles.length === 0 && !showForm && (
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-6">
              <p className="text-warning font-medium">
                Você precisa cadastrar veículos primeiro antes de registrar manutenções.
              </p>
            </div>
          )}

          {/* Content */}
          {showForm ? (
            <MaintenanceForm
              vehicles={vehicles}
              initialData={editingRecord}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          ) : (
            <MaintenanceList
              records={records}
              onEdit={handleEdit}
              onDelete={deleteRecord}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Maintenance;
