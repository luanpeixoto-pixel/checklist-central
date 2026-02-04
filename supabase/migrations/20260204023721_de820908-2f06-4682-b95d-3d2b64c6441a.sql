-- Fix schema to enforce NOT NULL on user_id columns
-- This aligns the database schema with the application's enforcement of authentication

-- First, delete any records with NULL user_id (shouldn't exist due to RLS, but be safe)
DELETE FROM public.analytics_events WHERE user_id IS NULL;
DELETE FROM public.popup_responses WHERE user_id IS NULL;

-- Now set the columns to NOT NULL
ALTER TABLE public.analytics_events ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.popup_responses ALTER COLUMN user_id SET NOT NULL;