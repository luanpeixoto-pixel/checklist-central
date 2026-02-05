import { supabase } from "@/integrations/supabase/client";
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
    const sessionId = crypto.randomUUID();
    
    await supabase.from("analytics_events").insert({
      user_id: userId,
      event_type: action,
      event_name: resourceType ? `${action}_${resourceType}` : action,
      page_path: typeof window !== "undefined" ? window.location.pathname : "/",
      session_id: sessionId,
      metadata: {
        resource_type: resourceType ?? null,
        resource_id: resourceId ?? null,
        ...metadata,
      } as Json,
    });
  } catch (error) {
    console.error("Failed to track user event:", error);
  }
};
