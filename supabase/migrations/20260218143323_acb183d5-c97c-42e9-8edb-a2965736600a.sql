
-- Create storage bucket for fleet images
INSERT INTO storage.buckets (id, name, public) VALUES ('fleet-images', 'fleet-images', true);

-- RLS policies for fleet-images bucket
CREATE POLICY "Users can upload their own fleet images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'fleet-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own fleet images"
ON storage.objects FOR SELECT
USING (bucket_id = 'fleet-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own fleet images"
ON storage.objects FOR DELETE
USING (bucket_id = 'fleet-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public can view fleet images"
ON storage.objects FOR SELECT
USING (bucket_id = 'fleet-images');

-- Add imagens column to maintenance_records
ALTER TABLE public.maintenance_records ADD COLUMN imagens text[] DEFAULT '{}';

-- Add imagens column to fuel_records
ALTER TABLE public.fuel_records ADD COLUMN imagens text[] DEFAULT '{}';
