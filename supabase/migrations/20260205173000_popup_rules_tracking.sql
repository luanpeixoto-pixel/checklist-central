-- Popup tracking tables for code-driven popup engine
CREATE TABLE public.popup_tracking_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  popup_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('shown', 'clicked', 'input', 'closed')),
  input_value TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_popup_tracking_events_user_id ON public.popup_tracking_events(user_id);
CREATE INDEX idx_popup_tracking_events_popup_id ON public.popup_tracking_events(popup_id);
CREATE INDEX idx_popup_tracking_events_event_type ON public.popup_tracking_events(event_type);
CREATE INDEX idx_popup_tracking_events_created_at ON public.popup_tracking_events(created_at);

ALTER TABLE public.popup_tracking_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own popup tracking events"
ON public.popup_tracking_events
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own popup tracking events"
ON public.popup_tracking_events
FOR SELECT
USING (auth.uid() = user_id);

CREATE TABLE public.popup_user_state (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  popup_id TEXT NOT NULL,
  display_count INTEGER NOT NULL DEFAULT 0,
  last_displayed_at TIMESTAMP WITH TIME ZONE,
  last_clicked_at TIMESTAMP WITH TIME ZONE,
  last_input_at TIMESTAMP WITH TIME ZONE,
  last_input_value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, popup_id)
);

CREATE INDEX idx_popup_user_state_user_id ON public.popup_user_state(user_id);

ALTER TABLE public.popup_user_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own popup state"
ON public.popup_user_state
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own popup state"
ON public.popup_user_state
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own popup state"
ON public.popup_user_state
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
