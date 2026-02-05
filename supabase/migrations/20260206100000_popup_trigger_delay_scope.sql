ALTER TABLE public.popup_triggers
  ADD COLUMN IF NOT EXISTS delay_seconds INTEGER,
  ADD COLUMN IF NOT EXISTS pages TEXT[],
  ADD COLUMN IF NOT EXISTS trigger_event_name TEXT;
