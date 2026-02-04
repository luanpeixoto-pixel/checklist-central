import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./useAuth";
import type { Vehicle, VehicleFormData } from "@/types/fleet";
import { toast } from "sonner";

export const useVehicles = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = useCallback(async () => {
    if (!user) {
      setVehicles([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Erro ao carregar veículos");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const addVehicle = async (data: VehicleFormData): Promise<boolean> => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return false;
    }

    try {
      const { data: newVehicle, error } = await supabase
        .from("vehicles")
        .insert({
          user_id: user.id,
          ...data,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error("Já existe um veículo com esta placa");
        } else {
          throw error;
        }
        return false;
      }

      setVehicles((prev) => [newVehicle, ...prev]);
      toast.success("Veículo cadastrado com sucesso!");
      return true;
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast.error("Erro ao cadastrar veículo");
      return false;
    }
  };

  const updateVehicle = async (id: string, data: Partial<VehicleFormData>): Promise<boolean> => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return false;
    }

    try {
      const { error } = await supabase
        .from("vehicles")
        .update(data)
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? { ...v, ...data } : v))
      );
      toast.success("Veículo atualizado com sucesso!");
      return true;
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast.error("Erro ao atualizar veículo");
      return false;
    }
  };

  const deleteVehicle = async (id: string): Promise<boolean> => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return false;
    }

    try {
      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setVehicles((prev) => prev.filter((v) => v.id !== id));
      toast.success("Veículo excluído com sucesso");
      return true;
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Erro ao excluir veículo");
      return false;
    }
  };

  return {
    vehicles,
    loading,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    refetch: fetchVehicles,
    activeVehicles: vehicles.filter(v => v.status === 'ativo'),
  };
};
