import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./useAuth";
import type { ChecklistData } from "@/types/checklist";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

const MAX_CHECKLISTS = 10;

export const useChecklists = () => {
  const { user } = useAuth();
  const [checklists, setChecklists] = useState<ChecklistData[]>([]);
  const [loading, setLoading] = useState(true);
  const [limitReached, setLimitReached] = useState(false);

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

      const parsedChecklists: ChecklistData[] = (data || []).map((row) => ({
        ...(row.data as unknown as ChecklistData),
        id: row.id,
        createdAt: new Date(row.created_at),
      }));

      setChecklists(parsedChecklists);
      setLimitReached(parsedChecklists.length >= MAX_CHECKLISTS);
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

  const canAddChecklist = () => {
    return checklists.length < MAX_CHECKLISTS;
  };

  const addChecklist = async (data: ChecklistData): Promise<boolean> => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return false;
    }

    if (!canAddChecklist()) {
      setLimitReached(true);
      return false;
    }

    try {
      const { data: newData, error } = await supabase
        .from("checklists")
        .insert({
          user_id: user.id,
          data: data as unknown as Json,
        })
        .select()
        .single();

      if (error) throw error;

      const newChecklist: ChecklistData = {
        ...data,
        id: newData.id,
        createdAt: new Date(newData.created_at),
      };

      setChecklists((prev) => {
        const updated = [newChecklist, ...prev];
        setLimitReached(updated.length >= MAX_CHECKLISTS);
        return updated;
      });

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

    try {
      const { error } = await supabase
        .from("checklists")
        .update({
          data: data as unknown as Json,
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setChecklists((prev) =>
        prev.map((c) => (c.id === id ? { ...data, id, createdAt: c.createdAt } : c))
      );

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
      const { error } = await supabase
        .from("checklists")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setChecklists((prev) => {
        const updated = prev.filter((c) => c.id !== id);
        setLimitReached(updated.length >= MAX_CHECKLISTS);
        return updated;
      });

      toast.success("Checklist excluído com sucesso");
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
    limitReached,
    setLimitReached,
    canAddChecklist,
    addChecklist,
    updateChecklist,
    deleteChecklist,
    refetch: fetchChecklists,
    maxChecklists: MAX_CHECKLISTS,
    remainingChecklists: MAX_CHECKLISTS - checklists.length,
  };
};

