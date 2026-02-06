import type { Json } from "@/integrations/supabase/types";

export type EventAction = "acesso" | "clique" | "cadastro" | "edicao" | "delete" | "exportacao";

interface TrackUserEventInput {
  userId: string;
  action: EventAction;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, Json>;
}

/**
 * Legacy function for tracking user events.
 * This is now a no-op as the event_tracking_events table was removed.
 * All tracking is now handled by the analytics_events table via useAnalytics hook.
 */
export const trackUserEvent = async ({
  userId: _userId,
  action: _action,
  resourceType: _resourceType,
  resourceId: _resourceId,
  metadata: _metadata,
}: TrackUserEventInput): Promise<void> => {
  // No-op: event_tracking_events table was removed
  // Use useAnalytics hook for event tracking
};
