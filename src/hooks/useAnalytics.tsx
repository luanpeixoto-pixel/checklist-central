import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./useAuth";
import type { Json } from "@/integrations/supabase/types";
import { trackUserEvent } from "@/lib/eventTracking";

interface TrackEventOptions {
  eventName?: string;
  elementId?: string;
  elementClass?: string;
  elementText?: string;
  scrollDepth?: number;
  metadata?: Record<string, Json>;
}

// Generate a session ID that persists during the browser session
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
};

export const useAnalytics = () => {
  const { user } = useAuth();
  const sessionId = useRef(getSessionId());
  const lastScrollDepth = useRef(0);
  const scrollThrottleTimeout = useRef<NodeJS.Timeout | null>(null);

  const trackEvent = useCallback(
    async (
      eventType: "page_view" | "click" | "scroll" | "form_submit" | "hover" | "custom",
      options: TrackEventOptions = {}
    ) => {
      if (!user?.id) return;

      try {
        await supabase.from("analytics_events").insert([{
          user_id: user.id,
          session_id: sessionId.current,
          event_type: eventType,
          event_name: options.eventName,
          page_path: window.location.pathname,
          element_id: options.elementId,
          element_class: options.elementClass,
          element_text: options.elementText?.substring(0, 100),
          scroll_depth: options.scrollDepth,
          metadata: options.metadata || {},
        }]);
      } catch (error) {
        console.error("Failed to track event:", error);
      }
    },
    [user?.id]
  );

  // Track page views
  const trackPageView = useCallback(() => {
    trackEvent("page_view");
    if (user?.id) {
      void trackUserEvent({ userId: user.id, action: "acesso", resourceType: "page", metadata: { path: window.location.pathname } });
    }
  }, [trackEvent, user?.id]);

  // Track clicks with data attributes
  const handleClick = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const trackableElement = target.closest("[data-track]");
      const clickedElement = (trackableElement || target) as HTMLElement;

      trackEvent("click", {
        eventName: clickedElement.dataset.track || `click:${clickedElement.tagName.toLowerCase()}`,
        elementId: clickedElement.id || undefined,
        elementClass: clickedElement.className || undefined,
        elementText: clickedElement.textContent?.trim() || undefined,
        metadata: clickedElement.dataset.trackMeta
          ? JSON.parse(clickedElement.dataset.trackMeta)
          : undefined,
      });

      if (user?.id) {
        void trackUserEvent({
          userId: user.id,
          action: "clique",
          resourceType: "ui",
          metadata: {
            tag: clickedElement.tagName.toLowerCase(),
            path: window.location.pathname,
            id: clickedElement.id || null,
          } as Record<string, Json>,
        });
      }
    },
    [trackEvent, user?.id]
  );

  // Track scroll depth
  const handleScroll = useCallback(() => {
    if (scrollThrottleTimeout.current) return;

    scrollThrottleTimeout.current = setTimeout(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

      // Only track significant scroll changes (every 25%)
      const milestone = Math.floor(scrollPercent / 25) * 25;
      if (milestone > lastScrollDepth.current && milestone <= 100) {
        lastScrollDepth.current = milestone;
        trackEvent("scroll", { scrollDepth: milestone });
      }

      scrollThrottleTimeout.current = null;
    }, 500);
  }, [trackEvent]);

  // Track form submissions
  const handleFormSubmit = useCallback(
    (event: Event) => {
      const form = event.target as HTMLFormElement;
      if (form.dataset.track) {
        trackEvent("form_submit", {
          eventName: form.dataset.track,
          elementId: form.id || undefined,
          metadata: { formName: form.name || form.id } as Record<string, Json>,
        });
      }
    },
    [trackEvent]
  );

  // Set up automatic tracking
  useEffect(() => {
    if (!user?.id) return;

    // Track initial page view
    trackPageView();

    // Set up event listeners
    document.addEventListener("click", handleClick, true);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("submit", handleFormSubmit, true);

    // Track page views on route changes
    const handlePopState = () => trackPageView();
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("submit", handleFormSubmit, true);
      window.removeEventListener("popstate", handlePopState);
      if (scrollThrottleTimeout.current) {
        clearTimeout(scrollThrottleTimeout.current);
      }
    };
  }, [user?.id, trackPageView, handleClick, handleScroll, handleFormSubmit]);

  // Manual tracking function for custom events
  const track = useCallback(
    (eventName: string, metadata?: Record<string, Json>) => {
      trackEvent("custom", { eventName, metadata });
    },
    [trackEvent]
  );

  return { track, trackEvent, trackPageView };
};
