import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./useAuth";
import type { MaintenanceRecord, MaintenanceFormData } from "@/types/fleet";
import { toast } from "sonner";

export const useMaintenance = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
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
        .from("maintenance_records")
        .select(`
          *,
          vehicle:vehicles(*)
        `)
        .eq("user_id", user.id)
        .order("data_manutencao", { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error("Error fetching maintenance records:", error);
      toast.error("Erro ao carregar registros de manutenção");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const addRecord = async (data: MaintenanceFormData): Promise<boolean> => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return false;
    }

    try {
      const { data: newRecord, error } = await supabase
        .from("maintenance_records")
        .insert({
          user_id: user.id,
          ...data,
        })
        .select(`
          *,
          vehicle:vehicles(*)
        `)
        .single();

      if (error) throw error;

      setRecords((prev) => [newRecord, ...prev]);
      toast.success("Manutenção registrada com sucesso!");
      return true;
    } catch (error) {
      console.error("Error adding maintenance record:", error);
      toast.error("Erro ao registrar manutenção");
      return false;
    }
  };

  const updateRecord = async (id: string, data: Partial<MaintenanceFormData>): Promise<boolean> => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return false;
    }

    try {
      const { error } = await supabase
        .from("maintenance_records")
        .update(data)
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...data } : r))
      );
      toast.success("Registro atualizado com sucesso!");
      return true;
    } catch (error) {
      console.error("Error updating maintenance record:", error);
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
        .from("maintenance_records")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setRecords((prev) => prev.filter((r) => r.id !== id));
      toast.success("Registro excluído com sucesso");
      return true;
    } catch (error) {
      console.error("Error deleting maintenance record:", error);
      toast.error("Erro ao excluir registro");
      return false;
    }
  };

  // Calculate metrics
  const totalCost = records.reduce((sum, r) => sum + Number(r.custo || 0), 0);
  
  const topMaintenanceItems = records.reduce((acc, r) => {
    const existing = acc.find(item => item.item === r.item);
    if (existing) {
      existing.count++;
      existing.cost += Number(r.custo || 0);
    } else {
      acc.push({ item: r.item, count: 1, cost: Number(r.custo || 0) });
    }
    return acc;
  }, [] as { item: string; count: number; cost: number }[])
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    records,
    loading,
    addRecord,
    updateRecord,
    deleteRecord,
    refetch: fetchRecords,
    totalCost,
    topMaintenanceItems,
  };
};
