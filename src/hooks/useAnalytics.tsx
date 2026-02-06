import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./useAuth";
import type { Json } from "@/integrations/supabase/types";
import { trackUserEvent } from "@/lib/eventTracking";
import { emitPopupTriggerEvent } from "@/lib/popupEvents";

interface TrackEventOptions {
  eventName?: string;
  elementId?: string;
  elementClass?: string;
  elementText?: string;
  scrollDepth?: number;
  metadata?: Record<string, Json>;
}

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
};

const safeParseJson = (value: string | undefined): Record<string, Json> => {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value) as Record<string, Json>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const useAnalytics = () => {
  const { user } = useAuth();
  const sessionId = useRef(getSessionId());
  const lastScrollDepth = useRef(0);
  const scrollThrottleTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastPathRef = useRef<string>(window.location.pathname);

  const trackEvent = useCallback(
    async (
      eventType: "page_view" | "click" | "scroll" | "form_submit" | "hover" | "custom",
      options: TrackEventOptions = {}
    ) => {
      if (!user?.id) return;

      const mergedMetadata: Record<string, Json> = {
        path: window.location.pathname,
        href: window.location.href,
        ...options.metadata,
      };

      try {
        await supabase.from("analytics_events").insert([{
          user_id: user.id,
          session_id: sessionId.current,
          event_type: eventType,
          event_name: options.eventName,
          page_path: window.location.pathname,
          element_id: options.elementId || null,
          element_class: options.elementClass || null,
          element_text: options.elementText?.substring(0, 100) || null,
          scroll_depth: options.scrollDepth ?? null,
          metadata: mergedMetadata,
        }]);
      } catch (error) {
        console.error("Failed to track event:", error);
      }
    },
    [user?.id]
  );

  const trackPageView = useCallback(() => {
    trackEvent("page_view", {
      metadata: {
        title: document.title,
        referrer: document.referrer || null,
      },
    });

    if (user?.id) {
      void trackUserEvent({ userId: user.id, action: "acesso", resourceType: "page", metadata: { path: window.location.pathname } });
    }
  }, [trackEvent, user?.id]);

  const handleClick = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const trackableElement = target.closest("[data-track]");
      const clickedElement = (trackableElement || target) as HTMLElement;
      const tag = clickedElement.tagName.toLowerCase();
      const parsedMeta = safeParseJson(clickedElement.dataset.trackMeta);
      const fallbackElementId = clickedElement.id || clickedElement.getAttribute("name") || `${tag}:${clickedElement.className || "no-class"}`;

      const eventName = clickedElement.dataset.track || `click:${tag}`;

      trackEvent("click", {
        eventName,
        elementId: fallbackElementId,
        elementClass: clickedElement.className || undefined,
        elementText: clickedElement.textContent?.trim() || undefined,
        metadata: {
          ...parsedMeta,
          tag,
          hasDataTrack: Boolean(clickedElement.dataset.track),
        },
      });

      // Emit popup trigger event for data-track elements
      if (clickedElement.dataset.track) {
        // Small delay to ensure analytics event is recorded first
        setTimeout(() => {
          emitPopupTriggerEvent(eventName);
        }, 100);
      }

      if (user?.id) {
        void trackUserEvent({
          userId: user.id,
          action: "clique",
          resourceType: "ui",
          metadata: {
            tag,
            path: window.location.pathname,
            id: clickedElement.id || null,
          } as Record<string, Json>,
        });
      }
    },
    [trackEvent, user?.id]
  );

  const handleScroll = useCallback(() => {
    if (scrollThrottleTimeout.current) return;

    scrollThrottleTimeout.current = setTimeout(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

      const milestone = Math.floor(scrollPercent / 25) * 25;
      if (milestone > lastScrollDepth.current && milestone <= 100) {
        lastScrollDepth.current = milestone;
        trackEvent("scroll", {
          scrollDepth: milestone,
          metadata: {
            scrollTop,
            docHeight,
            viewportHeight: window.innerHeight,
          },
        });
      }

      scrollThrottleTimeout.current = null;
    }, 500);
  }, [trackEvent]);

  const handleFormSubmit = useCallback(
    (event: Event) => {
      const form = event.target as HTMLFormElement;
      if (form.dataset.track) {
        trackEvent("form_submit", {
          eventName: form.dataset.track,
          elementId: form.id || form.name || undefined,
          metadata: {
            formName: form.name || form.id || "unknown",
            method: form.method || "get",
          } as Record<string, Json>,
        });
      }
    },
    [trackEvent]
  );

  useEffect(() => {
    if (!user?.id) return;

    trackPageView();

    document.addEventListener("click", handleClick, true);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("submit", handleFormSubmit, true);

    const handlePopState = () => trackPageView();
    window.addEventListener("popstate", handlePopState);

    const pathWatcher = window.setInterval(() => {
      const currentPath = window.location.pathname;
      if (currentPath !== lastPathRef.current) {
        lastPathRef.current = currentPath;
        trackPageView();
      }
    }, 500);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("submit", handleFormSubmit, true);
      window.removeEventListener("popstate", handlePopState);
      window.clearInterval(pathWatcher);
      if (scrollThrottleTimeout.current) {
        clearTimeout(scrollThrottleTimeout.current);
      }
    };
  }, [user?.id, trackPageView, handleClick, handleScroll, handleFormSubmit]);

  const track = useCallback(
    (eventName: string, metadata?: Record<string, Json>) => {
      trackEvent("custom", { eventName, metadata });
    },
    [trackEvent]
  );

  return { track, trackEvent, trackPageView };
};
