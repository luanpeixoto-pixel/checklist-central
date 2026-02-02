-- Create checklists table to store vehicle inspections
CREATE TABLE public.checklists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;

-- Users can only view their own checklists
CREATE POLICY "Users can view their own checklists"
ON public.checklists
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own checklists (max 10 enforced in app)
CREATE POLICY "Users can insert their own checklists"
ON public.checklists
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own checklists
CREATE POLICY "Users can update their own checklists"
ON public.checklists
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own checklists
CREATE POLICY "Users can delete their own checklists"
ON public.checklists
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_checklists_updated_at
BEFORE UPDATE ON public.checklists
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();