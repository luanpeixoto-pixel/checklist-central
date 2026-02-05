import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./useAuth";
import type { FuelRecord, FuelFormData } from "@/types/fleet";
import { toast } from "sonner";
import { trackUserEvent } from "@/lib/eventTracking";

export const useFuel = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<FuelRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = useCallback(async () => {
    if (!user) {
      setRecords([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("fuel_records")
        .select(`
          *,
          vehicle:vehicles(*)
        `)
        .eq("user_id", user.id)
        .order("data_abastecimento", { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error("Error fetching fuel records:", error);
      toast.error("Erro ao carregar registros de abastecimento");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const addRecord = async (data: FuelFormData): Promise<boolean> => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return false;
    }

    // Calculate valor_litro
    const valor_litro = data.valor_total / data.litros;

    // Get last record for this vehicle to calculate km_rodados
    const lastRecordForVehicle = records
      .filter(r => r.vehicle_id === data.vehicle_id)
      .sort((a, b) => new Date(b.data_abastecimento).getTime() - new Date(a.data_abastecimento).getTime())[0];

    const km_rodados = lastRecordForVehicle 
      ? data.quilometragem - lastRecordForVehicle.quilometragem 
      : undefined;
    
    const km_por_litro = km_rodados && data.tanque_cheio && lastRecordForVehicle?.tanque_cheio
      ? km_rodados / data.litros
      : undefined;

    try {
      const { data: newRecord, error } = await supabase
        .from("fuel_records")
        .insert({
          user_id: user.id,
          ...data,
          valor_litro,
          km_rodados,
          km_por_litro,
        })
        .select(`
          *,
          vehicle:vehicles(*)
        `)
        .single();

      if (error) throw error;

      // Update vehicle's current mileage
      await supabase
        .from("vehicles")
        .update({ quilometragem_atual: data.quilometragem })
        .eq("id", data.vehicle_id);

      setRecords((prev) => [newRecord, ...prev]);
      toast.success("Abastecimento registrado com sucesso!");
      void trackUserEvent({ userId: user.id, action: "cadastro", resourceType: "abastecimento", resourceId: newRecord.id });
      return true;
    } catch (error) {
      console.error("Error adding fuel record:", error);
      toast.error("Erro ao registrar abastecimento");
      return false;
    }
  };

  const updateRecord = async (id: string, data: Partial<FuelFormData>): Promise<boolean> => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return false;
    }

    try {
      // Recalculate valor_litro if needed
      const updateData: Record<string, unknown> = { ...data };
      if (data.valor_total && data.litros) {
        updateData.valor_litro = data.valor_total / data.litros;
      }

      const { error } = await supabase
        .from("fuel_records")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updateData } : r))
      );
      toast.success("Registro atualizado com sucesso!");
      void trackUserEvent({ userId: user.id, action: "edicao", resourceType: "abastecimento", resourceId: id });
      return true;
    } catch (error) {
      console.error("Error updating fuel record:", error);
      toast.error("Erro ao atualizar registro");
      return false;
    }
  };

  const deleteRecord = async (id: string): Promise<boolean> => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return false;
    }

    try {
      const { error } = await supabase
        .from("fuel_records")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setRecords((prev) => prev.filter((r) => r.id !== id));
      toast.success("Registro excluído com sucesso");
      void trackUserEvent({ userId: user.id, action: "delete", resourceType: "abastecimento", resourceId: id });
      return true;
    } catch (error) {
      console.error("Error deleting fuel record:", error);
      toast.error("Erro ao excluir registro");
      return false;
    }
  };

  // Calculate metrics
  const totalCost = records.reduce((sum, r) => sum + Number(r.valor_total || 0), 0);
  const totalLiters = records.reduce((sum, r) => sum + Number(r.litros || 0), 0);
  
  const avgKmPerLiter = records
    .filter(r => r.km_por_litro)
    .reduce((sum, r, _, arr) => sum + Number(r.km_por_litro || 0) / arr.length, 0);

  return {
    records,
    loading,
    addRecord,
    updateRecord,
    deleteRecord,
    refetch: fetchRecords,
    totalCost,
    totalLiters,
    avgKmPerLiter,
  };
};
