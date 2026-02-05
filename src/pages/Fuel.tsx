import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { FuelForm } from "@/components/fuel/FuelForm";
import { FuelList } from "@/components/fuel/FuelList";
import { EmptyState } from "@/components/EmptyState";
import { useFuel } from "@/hooks/useFuel";
import { useVehicles } from "@/hooks/useVehicles";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FuelRecord, FuelFormData } from "@/types/fleet";

const Fuel = () => {
  const { records, loading, addRecord, updateRecord, deleteRecord, totalCost, totalLiters, avgKmPerLiter } = useFuel();
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FuelRecord | null>(null);

  const handleSubmit = async (data: FuelFormData) => {
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

  const handleEdit = (record: FuelRecord) => {
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

  // Se não há veículos, mostra estado vazio centralizado
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
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {showForm ? (editingRecord ? 'Editar Abastecimento' : 'Novo Abastecimento') : 'Controle de Combustível'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {showForm 
                  ? 'Preencha os dados do abastecimento'
                  : `${records.length} registro${records.length !== 1 ? 's' : ''} • Total: ${formatCurrency(totalCost)} • ${totalLiters.toFixed(1)}L`
                }
              </p>
            </div>
            {!showForm && (
              <Button 
                data-track="click_new_fuel"
                onClick={() => setShowForm(true)} 
                className="gap-2"
                data-track="novo_abastecimento"
              >
                <Plus className="h-4 w-4" />
                Novo Abastecimento
              </Button>
            )}
          </div>

          {/* Avg km/L display */}
          {!showForm && avgKmPerLiter > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">
                Média de consumo da frota: <span className="text-primary font-bold">{avgKmPerLiter.toFixed(1)} km/L</span>
              </p>
            </div>
          )}

          {/* Content */}
          {showForm ? (
            <FuelForm
              vehicles={vehicles}
              initialData={editingRecord}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          ) : (
            <FuelList
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

export default Fuel;
