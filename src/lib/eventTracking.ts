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
 * Legacy event tracking function.
 * The event_tracking_events table no longer exists - analytics are now tracked
 * via analytics_events table in useAnalytics hook.
 * This function is kept as a no-op to avoid breaking existing code.
 */
export const trackUserEvent = async (_input: TrackUserEventInput): Promise<void> => {
  // No-op: analytics are now handled by useAnalytics via analytics_events table
};
