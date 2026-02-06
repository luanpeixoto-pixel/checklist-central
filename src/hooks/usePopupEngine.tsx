import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { subscribeToPopupTriggerEvents } from "@/lib/popupEvents";
import type { PopupDefinition, PopupTrigger, PopupWithTrigger, TriggerConditions } from "@/types/popup";

interface DisplayRecord {
  popup_id: string;
  count: number;
  lastDisplayed: Date | null;
}

export const usePopupEngine = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentPopup, setCurrentPopup] = useState<PopupWithTrigger | null>(null);
  const [triggers, setTriggers] = useState<(PopupTrigger & { popup: PopupDefinition })[]>([]);
  const [displayCounts, setDisplayCounts] = useState<Record<string, DisplayRecord>>({});
  const [lastTriggerEvent, setLastTriggerEvent] = useState<string | null>(null);
  const [pendingTrigger, setPendingTrigger] = useState<(PopupTrigger & { popup: PopupDefinition }) | null>(null);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch triggers from database
  const loadTriggers = useCallback(async () => {
    const { data: triggersData } = await supabase
      .from("popup_triggers")
      .select(`
        *,
        popup:popup_definitions(*)
      `)
      .eq("is_active", true)
      .order("priority", { ascending: false });

    if (triggersData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setTriggers(triggersData as any);
    }
  }, []);

  // Fetch user's display history
  const loadDisplayHistory = useCallback(async () => {
    if (!user?.id) return;

    const { data } = await supabase
      .from("popup_displays")
      .select("popup_id, displayed_at")
      .eq("user_id", user.id);

    if (data) {
      const counts: Record<string, DisplayRecord> = {};
      data.forEach((display) => {
        if (!counts[display.popup_id]) {
          counts[display.popup_id] = { popup_id: display.popup_id, count: 0, lastDisplayed: null };
        }
        counts[display.popup_id].count++;
        const displayedAt = new Date(display.displayed_at);
        if (!counts[display.popup_id].lastDisplayed || displayedAt > counts[display.popup_id].lastDisplayed!) {
          counts[display.popup_id].lastDisplayed = displayedAt;
        }
      });
      setDisplayCounts(counts);
    }
  }, [user?.id]);

  // Load data on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([loadTriggers(), loadDisplayHistory()]);
      setLoading(false);
    };
    void load();
  }, [loadTriggers, loadDisplayHistory]);

  // Subscribe to trigger events
  useEffect(() => {
    const unsubscribe = subscribeToPopupTriggerEvents((eventName) => {
      console.log("[PopupEngine] Received trigger event:", eventName);
      setLastTriggerEvent(eventName);
    });

    return unsubscribe;
  }, []);

  // Check trigger conditions
  const checkTriggerConditions = useCallback(
    async (trigger: PopupTrigger): Promise<boolean> => {
      if (!user?.id) return false;

      const conditions = trigger.conditions as TriggerConditions;

      switch (trigger.trigger_type) {
        case "event_count": {
          const cond = conditions as { event_type: string; event_name?: string; count: number };
          let query = supabase
            .from("analytics_events")
            .select("id", { count: "exact" })
            .eq("user_id", user.id)
            .eq("event_type", cond.event_type);

          if (cond.event_name) {
            query = query.eq("event_name", cond.event_name);
          }

          const { count } = await query;
          console.log(`[PopupEngine] event_count check: ${count || 0} >= ${cond.count}`, { trigger_id: trigger.id });
          return (count || 0) >= cond.count;
        }

        case "page_view": {
          const cond = conditions as { page_path?: string; page_count: number };
          let query = supabase
            .from("analytics_events")
            .select("id", { count: "exact" })
            .eq("user_id", user.id)
            .eq("event_type", "page_view");

          if (cond.page_path) {
            query = query.eq("page_path", cond.page_path);
          }

          const { count } = await query;
          return (count || 0) >= cond.page_count;
        }

        case "vehicle_count": {
          const cond = conditions as { min_vehicles: number; status?: string };
          let query = supabase
            .from("vehicles")
            .select("id", { count: "exact" })
            .eq("user_id", user.id);

          if (cond.status && cond.status !== "any") {
            query = query.eq("status", cond.status);
          }

          const { count } = await query;
          return (count || 0) >= cond.min_vehicles;
        }

        case "maintenance_spent": {
          const cond = conditions as { min_amount: number; period_days?: number };
          let query = supabase
            .from("maintenance_records")
            .select("custo")
            .eq("user_id", user.id);

          if (cond.period_days) {
            const since = new Date();
            since.setDate(since.getDate() - cond.period_days);
            query = query.gte("data_manutencao", since.toISOString().split("T")[0]);
          }

          const { data } = await query;
          const total = data?.reduce((sum, r) => sum + (Number(r.custo) || 0), 0) || 0;
          return total >= cond.min_amount;
        }

        case "fuel_count": {
          const cond = conditions as { min_records: number; period_days?: number };
          let query = supabase
            .from("fuel_records")
            .select("id", { count: "exact" })
            .eq("user_id", user.id);

          if (cond.period_days) {
            const since = new Date();
            since.setDate(since.getDate() - cond.period_days);
            query = query.gte("data_abastecimento", since.toISOString());
          }

          const { count } = await query;
          return (count || 0) >= cond.min_records;
        }

        default:
          return false;
      }
    },
    [user?.id],
  );

  // Check if popup can be displayed (respecting max_displays and cooldown)
  const canDisplayPopup = useCallback(
    (trigger: PopupTrigger): boolean => {
      const display = displayCounts[trigger.popup_id];
      if (!display) return true;

      // Check max displays
      if (trigger.max_displays && display.count >= trigger.max_displays) {
        console.log(`[PopupEngine] Max displays reached for popup ${trigger.popup_id}`);
        return false;
      }

      // Check cooldown
      if (trigger.cooldown_hours && display.lastDisplayed) {
        const cooldownMs = trigger.cooldown_hours * 60 * 60 * 1000;
        const timeSinceLastDisplay = Date.now() - display.lastDisplayed.getTime();
        if (timeSinceLastDisplay < cooldownMs) {
          console.log(`[PopupEngine] Still in cooldown for popup ${trigger.popup_id}`);
          return false;
        }
      }

      return true;
    },
    [displayCounts],
  );

  // Find eligible popup based on current state
  const findEligiblePopup = useCallback(async (): Promise<(PopupTrigger & { popup: PopupDefinition }) | null> => {
    if (!user?.id || loading) return null;

    const currentPath = window.location.pathname;
    console.log("[PopupEngine] Evaluating triggers for path:", currentPath, "lastEvent:", lastTriggerEvent);

    for (const trigger of triggers) {
      // Check if popup definition is active
      if (!trigger.popup?.is_active) continue;

      // Check display limits
      if (!canDisplayPopup(trigger)) continue;

      // Check page restriction
      if (trigger.pages?.length && !trigger.pages.includes(currentPath)) {
        console.log(`[PopupEngine] Trigger ${trigger.id} not on allowed page`);
        continue;
      }

      // Check event name restriction
      if (trigger.trigger_event_name && trigger.trigger_event_name !== lastTriggerEvent) {
        console.log(`[PopupEngine] Trigger ${trigger.id} waiting for event ${trigger.trigger_event_name}, got ${lastTriggerEvent}`);
        continue;
      }

      // Check conditions
      const conditionsMet = await checkTriggerConditions(trigger);
      if (conditionsMet) {
        console.log(`[PopupEngine] Found eligible trigger:`, trigger.id);
        return trigger;
      }
    }

    return null;
  }, [user?.id, loading, triggers, lastTriggerEvent, canDisplayPopup, checkTriggerConditions]);

  // Evaluate triggers when event happens
  useEffect(() => {
    if (!lastTriggerEvent || currentPopup || pendingTrigger) return;

    // Delay evaluation slightly to allow analytics event to be inserted first
    const timeoutId = setTimeout(async () => {
      const eligible = await findEligiblePopup();
      if (eligible) {
        console.log("[PopupEngine] Setting pending trigger:", eligible.id);
        setPendingTrigger(eligible);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [lastTriggerEvent, currentPopup, pendingTrigger, findEligiblePopup]);

  // Handle delay timer for pending trigger
  useEffect(() => {
    if (!pendingTrigger || currentPopup) return;

    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }

    const delayMs = Math.max(0, (pendingTrigger.delay_seconds || 0) * 1000);
    console.log(`[PopupEngine] Waiting ${delayMs}ms before showing popup`);

    if (!delayMs) {
      setCurrentPopup({ popup: pendingTrigger.popup, trigger: pendingTrigger });
      setPendingTrigger(null);
      setLastTriggerEvent(null);
      return;
    }

    delayTimerRef.current = setTimeout(() => {
      console.log("[PopupEngine] Delay complete, showing popup");
      setCurrentPopup({ popup: pendingTrigger.popup, trigger: pendingTrigger });
      setPendingTrigger(null);
      setLastTriggerEvent(null);
      delayTimerRef.current = null;
    }, delayMs);

    return () => {
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
    };
  }, [currentPopup, pendingTrigger]);

  // Record popup display
  const recordDisplay = useCallback(
    async (popupId: string, triggerId: string) => {
      if (!user?.id) return;

      await supabase.from("popup_displays").insert([
        {
          user_id: user.id,
          popup_id: popupId,
          trigger_id: triggerId,
        },
      ]);

      // Update local state
      setDisplayCounts((prev) => ({
        ...prev,
        [popupId]: {
          popup_id: popupId,
          count: (prev[popupId]?.count || 0) + 1,
          lastDisplayed: new Date(),
        },
      }));
    },
    [user?.id],
  );

  // Submit popup response
  const submitPopupInput = useCallback(
    async (value: string) => {
      if (!user?.id || !currentPopup) return;

      await supabase.from("popup_responses").insert([
        {
          user_id: user.id,
          popup_id: currentPopup.popup.id,
          trigger_id: currentPopup.trigger.id,
          response_data: { input: value },
        },
      ]);

      await recordDisplay(currentPopup.popup.id, currentPopup.trigger.id);
      setCurrentPopup(null);
    },
    [user?.id, currentPopup, recordDisplay],
  );

  // Dismiss popup
  const dismissPopup = useCallback(async () => {
    if (!currentPopup) return;
    await recordDisplay(currentPopup.popup.id, currentPopup.trigger.id);
    setCurrentPopup(null);
  }, [currentPopup, recordDisplay]);

  // Click popup CTA
  const clickPopup = useCallback(async () => {
    if (!currentPopup) return;
    await recordDisplay(currentPopup.popup.id, currentPopup.trigger.id);
    setCurrentPopup(null);
  }, [currentPopup, recordDisplay]);

  return {
    currentPopup,
    loading,
    dismissPopup,
    clickPopup,
    submitPopupInput,
    reloadPopupData: loadDisplayHistory,
  };
};
