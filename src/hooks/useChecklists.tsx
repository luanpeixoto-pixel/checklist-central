import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { ChecklistData } from "@/types/checklist";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";
import { trackUserEvent } from "@/lib/eventTracking";

export const useChecklists = () => {
  const { user } = useAuth();
  const [checklists, setChecklists] = useState<ChecklistData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChecklists = async () => {
    if (!user) {
      setChecklists([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("checklists")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const parsed: ChecklistData[] = (data || []).map((row) => ({
        ...(row.data as unknown as ChecklistData),
        id: row.id,
        createdAt: new Date(row.created_at),
      }));

      setChecklists(parsed);
    } catch (error) {
      console.error("Error fetching checklists:", error);
      toast.error("Erro ao carregar checklists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, [user]);

  const addChecklist = async (data: ChecklistData): Promise<boolean> => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return false;
    }

    if (!data.vehicle_id) {
      toast.error("Checklist precisa estar vinculado a um veículo");
      return false;
    }


    try {
      const payload: ChecklistData = {
        ...data,
        vehicle_id: data.vehicle_id, // explícito
      };

      const { data: newRow, error } = await supabase
        .from("checklists")
        .insert({
          user_id: user.id,
          data: payload as unknown as Json,
        })
        .select()
        .single();

      if (error) throw error;

      setChecklists((prev) => {
        const updated = [
          {
            ...payload,
            id: newRow.id,
            createdAt: new Date(newRow.created_at),
          },
          ...prev,
        ];
        return updated;
      });

      void trackUserEvent({ userId: user.id, action: "cadastro", resourceType: "checklist", resourceId: newRow.id });
      return true;
    } catch (error) {
      console.error("Error adding checklist:", error);
      toast.error("Erro ao salvar checklist");
      return false;
    }
  };

  const updateChecklist = async (id: string, data: ChecklistData): Promise<boolean> => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return false;
    }

    if (!data.vehicle_id) {
      toast.error("Checklist precisa estar vinculado a um veículo");
      return false;
    }

    try {
      const payload: ChecklistData = {
        ...data,
        vehicle_id: data.vehicle_id,
      };

      const { error } = await supabase
        .from("checklists")
        .update({
          data: payload as unknown as Json,
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setChecklists((prev) => prev.map((c) => (c.id === id ? { ...payload, id, createdAt: c.createdAt } : c)));
      void trackUserEvent({ userId: user.id, action: "edicao", resourceType: "checklist", resourceId: id });

      return true;
    } catch (error) {
      console.error("Error updating checklist:", error);
      toast.error("Erro ao atualizar checklist");
      return false;
    }
  };

  const deleteChecklist = async (id: string): Promise<boolean> => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return false;
    }

    try {
      const { error } = await supabase.from("checklists").delete().eq("id", id).eq("user_id", user.id);

      if (error) throw error;

      setChecklists((prev) => {
        const updated = prev.filter((c) => c.id !== id);
        return updated;
      });

      toast.success("Checklist excluído com sucesso");
      void trackUserEvent({ userId: user.id, action: "delete", resourceType: "checklist", resourceId: id });
      return true;
    } catch (error) {
      console.error("Error deleting checklist:", error);
      toast.error("Erro ao excluir checklist");
      return false;
    }
  };

  return {
    checklists,
    loading,
    addChecklist,
    updateChecklist,
    deleteChecklist,
    refetch: fetchChecklists,
  };
};
