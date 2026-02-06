import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./useAuth";
import type { Json } from "@/integrations/supabase/types";
import { subscribeToPopupTriggerEvents } from "@/lib/popupEvents";
import type {
  PopupDefinition,
  PopupTrigger,
  PopupWithTrigger,
  EventCountCondition,
  PageViewCondition,
  TimeOnPageCondition,
  ScrollDepthCondition,
} from "@/types/popup";

export const usePopupTriggers = () => {
  const { user } = useAuth();
  const [currentPopup, setCurrentPopup] = useState<PopupWithTrigger | null>(null);
  const [triggers, setTriggers] = useState<(PopupTrigger & { popup: PopupDefinition })[]>([]);
  const [displayCounts, setDisplayCounts] = useState<Record<string, { count: number; lastDisplayed: Date | null }>>({});
  const [lastTriggerEvent, setLastTriggerEvent] = useState<string | null>(null);
  const [pendingTrigger, setPendingTrigger] = useState<(PopupTrigger & { popup: PopupDefinition }) | null>(null);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pageStartTimeRef = useRef<number>(Date.now());

  // Fetch triggers and popups
  useEffect(() => {
    const fetchTriggers = async () => {
      const { data: triggersData } = await supabase
        .from("popup_triggers")
        .select(
          `
          *,
          popup:popup_definitions(*)
        `,
        )
        .eq("is_active", true)
        .order("priority", { ascending: false });

      if (triggersData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setTriggers(triggersData as any);
      }
    };

    void fetchTriggers();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToPopupTriggerEvents((eventName) => {
      setLastTriggerEvent(eventName);
    });

    return unsubscribe;
  }, []);

  // Fetch user's display history
  useEffect(() => {
    if (!user?.id) return;

    const fetchDisplayHistory = async () => {
      const { data } = await supabase.from("popup_displays").select("popup_id, displayed_at").eq("user_id", user.id);

      if (data) {
        const counts: Record<string, { count: number; lastDisplayed: Date | null }> = {};
        data.forEach((display) => {
          if (!counts[display.popup_id]) {
            counts[display.popup_id] = { count: 0, lastDisplayed: null };
          }
          counts[display.popup_id].count++;
          const displayedAt = new Date(display.displayed_at);
          if (!counts[display.popup_id].lastDisplayed || displayedAt > counts[display.popup_id].lastDisplayed!) {
            counts[display.popup_id].lastDisplayed = displayedAt;
          }
        });
        setDisplayCounts(counts);
      }
    };

    void fetchDisplayHistory();
  }, [user?.id]);

  // Check if trigger conditions are met
  const checkTriggerConditions = useCallback(
    async (trigger: PopupTrigger): Promise<boolean> => {
      if (!user?.id) return false;

      const conditions = trigger.conditions;
      const currentPath = window.location.pathname;

      if (trigger.pages?.length && !trigger.pages.includes(currentPath)) {
        return false;
      }

      if (trigger.trigger_event_name && trigger.trigger_event_name !== lastTriggerEvent) {
        return false;
      }

      switch (trigger.trigger_type) {
        case "event_count": {
          const cond = conditions as EventCountCondition;
          let query = supabase
            .from("analytics_events")
            .select("id", { count: "exact" })
            .eq("user_id", user.id)
            .eq("event_type", cond.event_type);

          if (cond.event_name) {
            query = query.eq("event_name", cond.event_name);
          }

          const { count } = await query;
          return (count || 0) >= cond.count;
        }

        case "page_view": {
          const cond = conditions as PageViewCondition;
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

        case "time_on_page": {
          const cond = conditions as TimeOnPageCondition;
          if (cond.page_path && cond.page_path !== currentPath) return false;
          const timeOnPage = (Date.now() - pageStartTimeRef.current) / 1000;
          return timeOnPage >= cond.time_seconds;
        }

        case "scroll_depth": {
          const cond = conditions as ScrollDepthCondition;
          if (cond.page_path && cond.page_path !== currentPath) return false;
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
          return scrollPercent >= cond.depth_percent;
        }

        default:
          return false;
      }
    },
    [lastTriggerEvent, user?.id],
  );

  // Check if popup can be displayed (respecting max_displays and cooldown)
  const canDisplayPopup = useCallback(
    (trigger: PopupTrigger): boolean => {
      const display = displayCounts[trigger.popup_id];
      if (!display) return true;

      // Check max displays
      if (trigger.max_displays && display.count >= trigger.max_displays) {
        return false;
      }

      // Check cooldown
      if (trigger.cooldown_hours && display.lastDisplayed) {
        const cooldownMs = trigger.cooldown_hours * 60 * 60 * 1000;
        const timeSinceLastDisplay = Date.now() - display.lastDisplayed.getTime();
        if (timeSinceLastDisplay < cooldownMs) {
          return false;
        }
      }

      return true;
    },
    [displayCounts],
  );

  // Evaluate all triggers
  const evaluateTriggers = useCallback(async () => {
    if (!user?.id || currentPopup || pendingTrigger) return;

    for (const trigger of triggers) {
      if (!canDisplayPopup(trigger)) continue;

      const conditionsMet = await checkTriggerConditions(trigger);
      if (conditionsMet) {
        setPendingTrigger(trigger);
        break;
      }
    }
  }, [user?.id, triggers, currentPopup, pendingTrigger, canDisplayPopup, checkTriggerConditions]);

  useEffect(() => {
    if (!pendingTrigger || currentPopup) return;

    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }

    const delayMs = Math.max(0, (pendingTrigger.delay_seconds || 0) * 1000);

    if (!delayMs) {
      setCurrentPopup({ popup: pendingTrigger.popup, trigger: pendingTrigger });
      setPendingTrigger(null);
      setLastTriggerEvent(null);
      return;
    }

    delayTimerRef.current = setTimeout(() => {
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

  // Set up periodic evaluation
  useEffect(() => {
    if (!user?.id) return;

    // Reset page start time on route change
    pageStartTimeRef.current = Date.now();

    // Evaluate triggers periodically
    const interval = setInterval(evaluateTriggers, 5000);

    // Also evaluate on scroll
    const handleScroll = () => {
      void evaluateTriggers();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
      }
    };
  }, [user?.id, evaluateTriggers]);

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
          count: (prev[popupId]?.count || 0) + 1,
          lastDisplayed: new Date(),
        },
      }));
    },
    [user?.id],
  );

  // Submit popup response
  const submitResponse = useCallback(
    async (responseData: Record<string, Json>) => {
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

    const { popup, trigger } = currentPopup;

    if (popup.popup_type === "redirect" && popup.redirect_url) {
      const redirectUrl = popup.redirect_url.trim();
      const hasProtocol = /^https?:\/\//i.test(redirectUrl);
      const targetUrl = hasProtocol ? redirectUrl : `https://${redirectUrl}`;
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }

    await recordDisplay(popup.id, trigger.id);
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
