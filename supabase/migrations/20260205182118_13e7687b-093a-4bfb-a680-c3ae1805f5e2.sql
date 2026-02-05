-- =============================================
-- FIX 1: Create user_roles table for RBAC
-- =============================================

-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table (separate from profiles to prevent privilege escalation)
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can only view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Create security definer function to check admin role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- =============================================
-- FIX 2: Update popup_definitions policies - admin only for write operations
-- =============================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert popups" ON public.popup_definitions;
DROP POLICY IF EXISTS "Authenticated users can update popups" ON public.popup_definitions;
DROP POLICY IF EXISTS "Authenticated users can delete popups" ON public.popup_definitions;

-- Create admin-only policies for write operations
CREATE POLICY "Admin users can insert popups"
ON public.popup_definitions
FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Admin users can update popups"
ON public.popup_definitions
FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admin users can delete popups"
ON public.popup_definitions
FOR DELETE
USING (public.is_admin());

-- =============================================
-- FIX 3: Update popup_triggers policies - admin only for write operations
-- =============================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert triggers" ON public.popup_triggers;
DROP POLICY IF EXISTS "Authenticated users can update triggers" ON public.popup_triggers;
DROP POLICY IF EXISTS "Authenticated users can delete triggers" ON public.popup_triggers;

-- Create admin-only policies for write operations
CREATE POLICY "Admin users can insert triggers"
ON public.popup_triggers
FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Admin users can update triggers"
ON public.popup_triggers
FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admin users can delete triggers"
ON public.popup_triggers
FOR DELETE
USING (public.is_admin());