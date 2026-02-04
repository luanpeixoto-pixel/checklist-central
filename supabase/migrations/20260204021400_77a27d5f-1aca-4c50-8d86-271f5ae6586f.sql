-- Tabela de eventos de analytics
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'page_view', 'click', 'scroll', 'form_submit', 'hover'
  event_name TEXT, -- Nome customizado do evento
  page_path TEXT NOT NULL,
  element_id TEXT, -- ID do elemento clicado/interagido
  element_class TEXT,
  element_text TEXT,
  scroll_depth INTEGER, -- Porcentagem de scroll (0-100)
  metadata JSONB DEFAULT '{}', -- Dados extras do evento
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para consultas performáticas
CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_events_session_id ON public.analytics_events(session_id);

-- RLS para analytics_events
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Usuários podem inserir seus próprios eventos
CREATE POLICY "Users can insert their own events"
ON public.analytics_events
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Usuários podem ver seus próprios eventos
CREATE POLICY "Users can view their own events"
ON public.analytics_events
FOR SELECT
USING (auth.uid() = user_id);

-- Tabela de definições de popups
CREATE TABLE public.popup_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  form_schema JSONB NOT NULL, -- Schema do formulário (campos, tipos, validações)
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trigger para updated_at
CREATE TRIGGER update_popup_definitions_updated_at
BEFORE UPDATE ON public.popup_definitions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- RLS para popup_definitions (leitura pública para mostrar popups)
ALTER TABLE public.popup_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active popups"
ON public.popup_definitions
FOR SELECT
USING (is_active = true);

-- Tabela de triggers (condições para disparar popups)
CREATE TABLE public.popup_triggers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  popup_id UUID NOT NULL REFERENCES public.popup_definitions(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL, -- 'event_count', 'page_view', 'time_on_page', 'scroll_depth'
  conditions JSONB NOT NULL, -- Ex: {"event_type": "click", "count": 5} ou {"page_path": "/", "time_seconds": 30}
  priority INTEGER NOT NULL DEFAULT 0, -- Maior = mais prioritário
  max_displays INTEGER DEFAULT 1, -- Máximo de vezes para mostrar por usuário
  cooldown_hours INTEGER DEFAULT 24, -- Horas antes de mostrar novamente
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_popup_triggers_popup_id ON public.popup_triggers(popup_id);
CREATE INDEX idx_popup_triggers_is_active ON public.popup_triggers(is_active);

-- RLS para popup_triggers
ALTER TABLE public.popup_triggers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active triggers"
ON public.popup_triggers
FOR SELECT
USING (is_active = true);

-- Tabela de respostas dos popups
CREATE TABLE public.popup_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  popup_id UUID NOT NULL REFERENCES public.popup_definitions(id) ON DELETE CASCADE,
  trigger_id UUID REFERENCES public.popup_triggers(id) ON DELETE SET NULL,
  response_data JSONB NOT NULL, -- Dados do formulário preenchido
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_popup_responses_user_id ON public.popup_responses(user_id);
CREATE INDEX idx_popup_responses_popup_id ON public.popup_responses(popup_id);

-- RLS para popup_responses
ALTER TABLE public.popup_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own responses"
ON public.popup_responses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own responses"
ON public.popup_responses
FOR SELECT
USING (auth.uid() = user_id);

-- Tabela para rastrear exibições de popup por usuário (controlar cooldown)
CREATE TABLE public.popup_displays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  popup_id UUID NOT NULL REFERENCES public.popup_definitions(id) ON DELETE CASCADE,
  trigger_id UUID REFERENCES public.popup_triggers(id) ON DELETE SET NULL,
  displayed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_popup_displays_user_popup ON public.popup_displays(user_id, popup_id);

-- RLS para popup_displays
ALTER TABLE public.popup_displays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own displays"
ON public.popup_displays
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own displays"
ON public.popup_displays
FOR SELECT
USING (auth.uid() = user_id);