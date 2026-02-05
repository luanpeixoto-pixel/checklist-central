import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { POPUP_RULES, type PopupRule } from "@/config/popupRules";
import { subscribeToPopupTriggerEvents } from "@/lib/popupEvents";

interface PopupUserState {
  popup_id: string;
  display_count: number;
  last_displayed_at: string | null;
}

interface PopupSummary {
  total_vehicles: number;
  total_checklists: number;
  total_maintenance: number;
  total_fuel_records: number;
  maintenance_amount: number;
  fuel_amount: number;
}

interface PopupMetrics {
  visits: number;
  dataInputs: number;
  summary: PopupSummary;
}

const EMPTY_SUMMARY: PopupSummary = {
  total_vehicles: 0,
  total_checklists: 0,
  total_maintenance: 0,
  total_fuel_records: 0,
  maintenance_amount: 0,
  fuel_amount: 0,
};

const isInCooldown = (lastDisplayedAt: string | null, cooldownHours = 24) => {
  if (!lastDisplayedAt) return false;
  const last = new Date(lastDisplayedAt).getTime();
  const next = last + cooldownHours * 60 * 60 * 1000;
  return Date.now() < next;
};

export const usePopupEngine = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentPopup, setCurrentPopup] = useState<PopupRule | null>(null);
  const [popupState, setPopupState] = useState<Record<string, PopupUserState>>({});
  const [metrics, setMetrics] = useState<PopupMetrics>({
    visits: 0,
    dataInputs: 0,
    summary: EMPTY_SUMMARY,
  });
  const [lastTriggerEvent, setLastTriggerEvent] = useState<string | null>(null);
  const [timerReadyPopupId, setTimerReadyPopupId] = useState<string | null>(null);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadPopupData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [summaryRes, stateRes, eventsRes] = await Promise.all([
        supabase
          .from("event_tracking_summary" as never)
          .select("total_vehicles,total_checklists,total_maintenance,total_fuel_records,maintenance_amount,fuel_amount")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("popup_user_state" as never)
          .select("popup_id,display_count,last_displayed_at")
          .eq("user_id", user.id),
        supabase
          .from("event_tracking_events" as never)
          .select("action")
          .eq("user_id", user.id)
          .in("action", ["acesso", "cadastro"]),
      ]);

      const rows = (eventsRes.data || []) as Array<{ action: string }>;
      const visits = rows.filter((r) => r.action === "acesso").length;
      const dataInputs = rows.filter((r) => r.action === "cadastro").length;
      const mappedState = ((stateRes.data || []) as PopupUserState[]).reduce<Record<string, PopupUserState>>((acc, s) => {
        acc[s.popup_id] = s;
        return acc;
      }, {});

      setPopupState(mappedState);
      setMetrics({
        visits,
        dataInputs,
        summary: (summaryRes.data as PopupSummary) || EMPTY_SUMMARY,
      });
    } catch (error) {
      console.error("Failed loading popup data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void loadPopupData();
  }, [loadPopupData]);

  useEffect(() => {
    const unsubscribe = subscribeToPopupTriggerEvents((eventName) => {
      setLastTriggerEvent(eventName);
      void loadPopupData();
    });

    return unsubscribe;
  }, [loadPopupData]);

  const eligiblePopup = useMemo(() => {
    if (!user?.id || loading) return null;

    const currentPath = window.location.pathname;
    const sorted = [...POPUP_RULES].sort((a, b) => b.priority - a.priority);

    for (const rule of sorted) {
      const state = popupState[rule.id];
      const displayCount = state?.display_count || 0;

      if (rule.maxDisplays && displayCount >= rule.maxDisplays) continue;
      if (isInCooldown(state?.last_displayed_at || null, rule.cooldownHours ?? 24)) continue;

      if (rule.pages?.length && !rule.pages.includes(currentPath)) continue;
      if (rule.triggerEventName && lastTriggerEvent !== rule.triggerEventName) continue;

      const c = rule.conditions;
      if (c.minVisits && metrics.visits < c.minVisits) continue;
      if (c.minDataInputs && metrics.dataInputs < c.minDataInputs) continue;
      if (c.minVehicles && metrics.summary.total_vehicles < c.minVehicles) continue;
      if (c.minChecklists && metrics.summary.total_checklists < c.minChecklists) continue;
      if (c.minMaintenance && metrics.summary.total_maintenance < c.minMaintenance) continue;
      if (c.minFuelRecords && metrics.summary.total_fuel_records < c.minFuelRecords) continue;
      if (c.minMaintenanceAmount && metrics.summary.maintenance_amount < c.minMaintenanceAmount) continue;
      if (c.minFuelAmount && metrics.summary.fuel_amount < c.minFuelAmount) continue;

      return rule;
    }

    return null;
  }, [lastTriggerEvent, loading, metrics, popupState, user?.id]);

  useEffect(() => {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }

    setTimerReadyPopupId(null);

    if (!eligiblePopup) return;

    const delayMs = Math.max(0, (eligiblePopup.delaySeconds ?? 0) * 1000);
    if (!delayMs) {
      setTimerReadyPopupId(eligiblePopup.id);
      return;
    }

    delayTimerRef.current = setTimeout(() => {
      setTimerReadyPopupId(eligiblePopup.id);
      delayTimerRef.current = null;
    }, delayMs);

    return () => {
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
    };
  }, [eligiblePopup]);

  const trackPopupEvent = useCallback(
    async (popupId: string, eventType: "shown" | "clicked" | "input" | "closed", inputValue?: string) => {
      if (!user?.id) return;

      const now = new Date().toISOString();

      await supabase.from("popup_tracking_events" as never).insert({
        user_id: user.id,
        popup_id: popupId,
        event_type: eventType,
        input_value: inputValue || null,
        metadata: {
          path: window.location.pathname,
        },
      } as never);

      const current = popupState[popupId];
      const updatePayload: Record<string, unknown> = {
        user_id: user.id,
        popup_id: popupId,
        display_count: current?.display_count || 0,
      };

      if (eventType === "shown") {
        updatePayload.display_count = (current?.display_count || 0) + 1;
        updatePayload.last_displayed_at = now;
      }
      if (eventType === "clicked") {
        updatePayload.last_clicked_at = now;
      }
      if (eventType === "input") {
        updatePayload.last_input_at = now;
        updatePayload.last_input_value = inputValue || null;
      }

      await supabase.from("popup_user_state" as never).upsert(updatePayload as never, {
        onConflict: "user_id,popup_id",
      });

      setPopupState((prev) => ({
        ...prev,
        [popupId]: {
          popup_id: popupId,
          display_count: Number(updatePayload.display_count),
          last_displayed_at: (updatePayload.last_displayed_at as string) || prev[popupId]?.last_displayed_at || null,
        },
      }));
    },
    [popupState, user?.id],
  );

  useEffect(() => {
    if (!eligiblePopup || timerReadyPopupId !== eligiblePopup.id || currentPopup?.id === eligiblePopup.id) return;
    setCurrentPopup(eligiblePopup);
    void trackPopupEvent(eligiblePopup.id, "shown");
  }, [currentPopup?.id, eligiblePopup, timerReadyPopupId, trackPopupEvent]);

  const dismissPopup = useCallback(async () => {
    if (!currentPopup) return;
    await trackPopupEvent(currentPopup.id, "closed");
    setCurrentPopup(null);
    setLastTriggerEvent(null);
  }, [currentPopup, trackPopupEvent]);

  const clickPopup = useCallback(async () => {
    if (!currentPopup) return;
    await trackPopupEvent(currentPopup.id, "clicked");
    setCurrentPopup(null);
    setLastTriggerEvent(null);
  }, [currentPopup, trackPopupEvent]);

  const submitPopupInput = useCallback(
    async (value: string) => {
      if (!currentPopup) return;
      await trackPopupEvent(currentPopup.id, "input", value);
      setCurrentPopup(null);
      setLastTriggerEvent(null);
    },
    [currentPopup, trackPopupEvent],
  );

  return {
    currentPopup,
    loading,
    dismissPopup,
    clickPopup,
    submitPopupInput,
    reloadPopupData: loadPopupData,
  };
};
