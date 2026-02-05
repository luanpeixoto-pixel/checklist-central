

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

  } catch (error) {
    console.error("Failed to track user event:", error);
  }
};
