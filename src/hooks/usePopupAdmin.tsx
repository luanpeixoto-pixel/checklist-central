import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { PopupDefinition, PopupTrigger, FormSchema } from "@/types/popup";

interface PopupDefinitionRow {
  id: string;
  name: string;
  title: string;
  description: string | null;
  form_schema: Json;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PopupTriggerRow {
  id: string;
  popup_id: string;
  trigger_type: string;
  conditions: Json;
  priority: number;
  max_displays: number | null;
  cooldown_hours: number | null;
  is_active: boolean;
  created_at: string;
}

export const usePopupAdmin = () => {
  const [popups, setPopups] = useState<PopupDefinition[]>([]);
  const [triggers, setTriggers] = useState<PopupTrigger[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPopups = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("popup_definitions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const mapped = (data as PopupDefinitionRow[] || []).map((row): PopupDefinition => {
        const schema = row.form_schema as unknown as FormSchema;
        return {
          id: row.id,
          name: row.name,
          title: row.title,
          description: row.description || undefined,
          popup_type: (schema as Record<string, unknown>)?.popup_type as PopupDefinition["popup_type"] || "submit",
          message: (schema as Record<string, unknown>)?.message as string || row.description || "",
          cta_text: schema?.submitButtonText || "Enviar",
          redirect_url: (schema as Record<string, unknown>)?.redirect_url as string || undefined,
          form_schema: schema,
          is_active: row.is_active,
          created_at: row.created_at,
          updated_at: row.updated_at,
        };
      });
      
      setPopups(mapped);
    } catch (error) {
      console.error("Error fetching popups:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTriggers = useCallback(async (popupId?: string) => {
    try {
      let query = supabase
        .from("popup_triggers")
        .select("*")
        .order("priority", { ascending: false });
      
      if (popupId) {
        query = query.eq("popup_id", popupId);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      const mapped = (data as PopupTriggerRow[] || []).map((row): PopupTrigger => {
        const conditions = row.conditions as unknown as Record<string, unknown>;
        const triggerCategory = (conditions?.trigger_category as PopupTrigger["trigger_category"]) || "action";
        const rowAny = row as unknown as Record<string, unknown>;
        return {
          id: row.id,
          popup_id: row.popup_id,
          trigger_category: triggerCategory,
          trigger_type: row.trigger_type as PopupTrigger["trigger_type"],
          conditions: row.conditions as unknown as PopupTrigger["conditions"],
          priority: row.priority,
          max_displays: row.max_displays,
          cooldown_hours: row.cooldown_hours,
          delay_seconds: (rowAny.delay_seconds as number | null) ?? null,
          pages: (rowAny.pages as string[] | null) ?? null,
          trigger_event_name: (rowAny.trigger_event_name as string | null) ?? null,
          is_active: row.is_active,
          created_at: row.created_at,
        };
      });
      
      setTriggers(mapped);
    } catch (error) {
      console.error("Error fetching triggers:", error);
    }
  }, []);

  useEffect(() => {
    void fetchPopups();
    void fetchTriggers();
  }, [fetchPopups, fetchTriggers]);

  const createPopup = useCallback(async (popup: Omit<PopupDefinition, "id" | "created_at" | "updated_at">) => {
    const enrichedSchema = {
      ...popup.form_schema,
      popup_type: popup.popup_type,
      message: popup.message,
      redirect_url: popup.redirect_url,
    };
    const { data, error } = await supabase
      .from("popup_definitions")
      .insert({
        name: popup.name,
        title: popup.title,
        description: popup.message || popup.description || null,
        form_schema: enrichedSchema as unknown as Json,
        is_active: popup.is_active,
      })
      .select()
      .single();

    if (error) throw error;
    await fetchPopups();
    return data;
  }, [fetchPopups]);

  const updatePopup = useCallback(async (id: string, popup: Partial<PopupDefinition>) => {
    const updateData: Record<string, unknown> = {};
    if (popup.name !== undefined) updateData.name = popup.name;
    if (popup.title !== undefined) updateData.title = popup.title;
    if (popup.message !== undefined) updateData.description = popup.message || null;
    if (popup.form_schema !== undefined) {
      const enrichedSchema = {
        ...popup.form_schema,
        popup_type: popup.popup_type,
        message: popup.message,
        redirect_url: popup.redirect_url,
      };
      updateData.form_schema = enrichedSchema as unknown as Json;
    }
    if (popup.is_active !== undefined) updateData.is_active = popup.is_active;

    const { error } = await supabase
      .from("popup_definitions")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;
    await fetchPopups();
  }, [fetchPopups]);

  const deletePopup = useCallback(async (id: string) => {
    const { error } = await supabase
      .from("popup_definitions")
      .delete()
      .eq("id", id);

    if (error) throw error;
    await fetchPopups();
  }, [fetchPopups]);

  const createTrigger = useCallback(async (trigger: Omit<PopupTrigger, "id" | "created_at">) => {
    const enrichedConditions = {
      ...trigger.conditions,
      trigger_category: trigger.trigger_category,
    };
    const { data, error } = await supabase
      .from("popup_triggers")
      .insert({
        popup_id: trigger.popup_id,
        trigger_type: trigger.trigger_type,
        conditions: enrichedConditions as unknown as Json,
        priority: trigger.priority,
        max_displays: trigger.max_displays,
        cooldown_hours: trigger.cooldown_hours,
        delay_seconds: trigger.delay_seconds,
        pages: trigger.pages,
        trigger_event_name: trigger.trigger_event_name,
        is_active: trigger.is_active,
      })
      .select()
      .single();

    if (error) throw error;
    await fetchTriggers();
    return data;
  }, [fetchTriggers]);

  const updateTrigger = useCallback(async (id: string, trigger: Partial<PopupTrigger>) => {
    const updateData: Record<string, unknown> = {};
    if (trigger.trigger_type !== undefined) updateData.trigger_type = trigger.trigger_type;
    if (trigger.conditions !== undefined) {
      const enrichedConditions = {
        ...trigger.conditions,
        trigger_category: trigger.trigger_category,
      };
      updateData.conditions = enrichedConditions as unknown as Json;
    }
    if (trigger.priority !== undefined) updateData.priority = trigger.priority;
    if (trigger.max_displays !== undefined) updateData.max_displays = trigger.max_displays;
    if (trigger.cooldown_hours !== undefined) updateData.cooldown_hours = trigger.cooldown_hours;
    if (trigger.delay_seconds !== undefined) updateData.delay_seconds = trigger.delay_seconds;
    if (trigger.pages !== undefined) updateData.pages = trigger.pages;
    if (trigger.trigger_event_name !== undefined) updateData.trigger_event_name = trigger.trigger_event_name;
    if (trigger.is_active !== undefined) updateData.is_active = trigger.is_active;

    const { error } = await supabase
      .from("popup_triggers")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;
    await fetchTriggers();
  }, [fetchTriggers]);

  const deleteTrigger = useCallback(async (id: string) => {
    const { error } = await supabase
      .from("popup_triggers")
      .delete()
      .eq("id", id);

    if (error) throw error;
    await fetchTriggers();
  }, [fetchTriggers]);

  return {
    popups,
    triggers,
    loading,
    fetchPopups,
    fetchTriggers,
    createPopup,
    updatePopup,
    deletePopup,
    createTrigger,
    updateTrigger,
    deleteTrigger,
  };
};
