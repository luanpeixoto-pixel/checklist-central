import { supabase } from "@/lib/supabaseClient";
import type { Json } from "@/integrations/supabase/types";

export type EventAction = "acesso" | "clique" | "cadastro" | "edicao" | "delete" | "exportacao";

interface TrackUserEventInput {
  userId: string;
  action: EventAction;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, Json>;
}

export const trackUserEvent = async ({
  userId,
  action,
  resourceType,
  resourceId,
  metadata,
}: TrackUserEventInput): Promise<void> => {
  try {
    await (supabase as any).from("event_tracking_events").insert({
      user_id: userId,
      action,
      resource_type: resourceType ?? null,
      resource_id: resourceId ?? null,
      page_path: typeof window !== "undefined" ? window.location.pathname : null,
      metadata: metadata ?? {},
    });
  } catch (error) {
    console.error("Failed to track user event:", error);
  }
};
