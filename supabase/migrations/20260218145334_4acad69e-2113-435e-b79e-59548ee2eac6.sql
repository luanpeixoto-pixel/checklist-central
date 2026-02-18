
-- Make fleet-images bucket private
UPDATE storage.buckets SET public = false WHERE id = 'fleet-images';

-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Public can view fleet images" ON storage.objects;
