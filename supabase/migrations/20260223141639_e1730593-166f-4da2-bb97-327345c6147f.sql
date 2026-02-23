
-- Create home_slides table for configurable slider
CREATE TABLE public.home_slides (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url text NOT NULL,
  redirect_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.home_slides ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view active slides
CREATE POLICY "Authenticated users can view active slides"
ON public.home_slides FOR SELECT
TO authenticated
USING (is_active = true);

-- Only admins can manage slides
CREATE POLICY "Admins can insert slides"
ON public.home_slides FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admins can update slides"
ON public.home_slides FOR UPDATE
USING (is_admin());

CREATE POLICY "Admins can delete slides"
ON public.home_slides FOR DELETE
USING (is_admin());

-- Admins can view all slides (including inactive)
CREATE POLICY "Admins can view all slides"
ON public.home_slides FOR SELECT
USING (is_admin());

-- Create storage bucket for slider images
INSERT INTO storage.buckets (id, name, public) VALUES ('home-slides', 'home-slides', true);

-- Storage policies for home-slides bucket
CREATE POLICY "Anyone can view slide images"
ON storage.objects FOR SELECT
USING (bucket_id = 'home-slides');

CREATE POLICY "Admins can upload slide images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'home-slides' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update slide images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'home-slides' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete slide images"
ON storage.objects FOR DELETE
USING (bucket_id = 'home-slides' AND auth.uid() IS NOT NULL);
