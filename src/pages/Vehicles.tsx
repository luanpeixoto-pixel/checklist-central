import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { VehicleForm } from "@/components/vehicles/VehicleForm";
import { VehicleList } from "@/components/vehicles/VehicleList";
import { useVehicles } from "@/hooks/useVehicles";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Vehicle, VehicleFormData } from "@/types/fleet";

const Vehicles = () => {
  const { vehicles, loading, addVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const handleSubmit = async (data: VehicleFormData) => {
    if (editingVehicle) {
      const success = await updateVehicle(editingVehicle.id, data);
      if (success) {
        setEditingVehicle(null);
        setShowForm(false);
      }
    } else {
      const success = await addVehicle(data);
      if (success) {
        setShowForm(false);
      }
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingVehicle(null);
    setShowForm(false);
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {showForm ? (editingVehicle ? 'Editar Veículo' : 'Novo Veículo') : 'Veículos'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {showForm 
                  ? 'Preencha os dados do veículo'
                  : `${vehicles.length} veículo${vehicles.length !== 1 ? 's' : ''} cadastrado${vehicles.length !== 1 ? 's' : ''}`
                }
              </p>
            </div>
            {!showForm && (
              <Button data-track="click_new_vehicle" onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Veículo
              </Button>
            )}
          </div>

          {/* Content */}
          {showForm ? (
            <VehicleForm
              initialData={editingVehicle}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          ) : (
            <VehicleList
              vehicles={vehicles}
              onEdit={handleEdit}
              onDelete={deleteVehicle}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Vehicles;
