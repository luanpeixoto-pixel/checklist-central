-- Event tracking table focused on product events by user
CREATE TABLE public.event_tracking_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('acesso', 'clique', 'cadastro', 'edicao', 'delete', 'exportacao')),
  resource_type TEXT,
  resource_id TEXT,
  page_path TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_event_tracking_events_user_id ON public.event_tracking_events(user_id);
CREATE INDEX idx_event_tracking_events_action ON public.event_tracking_events(action);
CREATE INDEX idx_event_tracking_events_created_at ON public.event_tracking_events(created_at);

ALTER TABLE public.event_tracking_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own tracked events"
ON public.event_tracking_events
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own tracked events"
ON public.event_tracking_events
FOR SELECT
USING (auth.uid() = user_id);

-- Compiled summary per user
CREATE TABLE public.event_tracking_summary (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_vehicles INTEGER NOT NULL DEFAULT 0,
  total_checklists INTEGER NOT NULL DEFAULT 0,
  total_maintenance INTEGER NOT NULL DEFAULT 0,
  total_fuel_records INTEGER NOT NULL DEFAULT 0,
  first_event_at TIMESTAMP WITH TIME ZONE,
  last_event_at TIMESTAMP WITH TIME ZONE,
  maintenance_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  fuel_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.event_tracking_summary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own event summary"
ON public.event_tracking_summary
FOR SELECT
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.refresh_event_tracking_summary(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_vehicles INTEGER := 0;
  v_total_checklists INTEGER := 0;
  v_total_maintenance INTEGER := 0;
  v_total_fuel INTEGER := 0;
  v_maintenance_amount NUMERIC(14,2) := 0;
  v_fuel_amount NUMERIC(14,2) := 0;
  v_first_event TIMESTAMP WITH TIME ZONE;
  v_last_event TIMESTAMP WITH TIME ZONE;
BEGIN
  IF target_user_id IS NULL THEN
    RETURN;
  END IF;

  SELECT COUNT(*) INTO v_total_vehicles FROM public.vehicles WHERE user_id = target_user_id;
  SELECT COUNT(*) INTO v_total_checklists FROM public.checklists WHERE user_id = target_user_id;
  SELECT COUNT(*) INTO v_total_maintenance FROM public.maintenance_records WHERE user_id = target_user_id;
  SELECT COUNT(*) INTO v_total_fuel FROM public.fuel_records WHERE user_id = target_user_id;

  SELECT COALESCE(SUM(custo), 0) INTO v_maintenance_amount
  FROM public.maintenance_records
  WHERE user_id = target_user_id;

  SELECT COALESCE(SUM(valor_total), 0) INTO v_fuel_amount
  FROM public.fuel_records
  WHERE user_id = target_user_id;

  SELECT MIN(created_at), MAX(created_at)
  INTO v_first_event, v_last_event
  FROM (
    SELECT created_at FROM public.event_tracking_events WHERE user_id = target_user_id
    UNION ALL
    SELECT created_at FROM public.vehicles WHERE user_id = target_user_id
    UNION ALL
    SELECT created_at FROM public.checklists WHERE user_id = target_user_id
    UNION ALL
    SELECT created_at FROM public.maintenance_records WHERE user_id = target_user_id
    UNION ALL
    SELECT created_at FROM public.fuel_records WHERE user_id = target_user_id
  ) events;

  INSERT INTO public.event_tracking_summary (
    user_id,
    total_vehicles,
    total_checklists,
    total_maintenance,
    total_fuel_records,
    first_event_at,
    last_event_at,
    maintenance_amount,
    fuel_amount,
    updated_at
  )
  VALUES (
    target_user_id,
    v_total_vehicles,
    v_total_checklists,
    v_total_maintenance,
    v_total_fuel,
    v_first_event,
    v_last_event,
    v_maintenance_amount,
    v_fuel_amount,
    now()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_vehicles = EXCLUDED.total_vehicles,
    total_checklists = EXCLUDED.total_checklists,
    total_maintenance = EXCLUDED.total_maintenance,
    total_fuel_records = EXCLUDED.total_fuel_records,
    first_event_at = EXCLUDED.first_event_at,
    last_event_at = EXCLUDED.last_event_at,
    maintenance_amount = EXCLUDED.maintenance_amount,
    fuel_amount = EXCLUDED.fuel_amount,
    updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_refresh_event_summary()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := COALESCE(NEW.user_id, OLD.user_id);
  PERFORM public.refresh_event_tracking_summary(v_user_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_refresh_summary_on_event_tracking_events
AFTER INSERT OR UPDATE OR DELETE ON public.event_tracking_events
FOR EACH ROW EXECUTE FUNCTION public.handle_refresh_event_summary();

CREATE TRIGGER trg_refresh_summary_on_vehicles
AFTER INSERT OR UPDATE OR DELETE ON public.vehicles
FOR EACH ROW EXECUTE FUNCTION public.handle_refresh_event_summary();

CREATE TRIGGER trg_refresh_summary_on_checklists
AFTER INSERT OR UPDATE OR DELETE ON public.checklists
FOR EACH ROW EXECUTE FUNCTION public.handle_refresh_event_summary();

CREATE TRIGGER trg_refresh_summary_on_maintenance
AFTER INSERT OR UPDATE OR DELETE ON public.maintenance_records
FOR EACH ROW EXECUTE FUNCTION public.handle_refresh_event_summary();

CREATE TRIGGER trg_refresh_summary_on_fuel
AFTER INSERT OR UPDATE OR DELETE ON public.fuel_records
FOR EACH ROW EXECUTE FUNCTION public.handle_refresh_event_summary();
