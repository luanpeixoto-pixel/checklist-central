-- Add delay_seconds, pages, and trigger_event_name columns to popup_triggers
ALTER TABLE public.popup_triggers
ADD COLUMN delay_seconds integer DEFAULT NULL,
ADD COLUMN pages text[] DEFAULT NULL,
ADD COLUMN trigger_event_name text DEFAULT NULL;