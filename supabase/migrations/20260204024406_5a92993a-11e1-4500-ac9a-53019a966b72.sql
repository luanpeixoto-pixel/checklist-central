-- Fix warn level security issues by adding missing restrictive RLS policies

-- 1. Analytics Events: Prevent users from deleting or updating their analytics events
-- This ensures data integrity for business analytics
CREATE POLICY "Prevent event deletion"
ON public.analytics_events
FOR DELETE
USING (false);

CREATE POLICY "Prevent event updates"
ON public.analytics_events
FOR UPDATE
USING (false);

-- 2. Popup Responses: Make survey responses immutable after submission
-- This ensures data integrity for user feedback
CREATE POLICY "Prevent response deletion"
ON public.popup_responses
FOR DELETE
USING (false);

CREATE POLICY "Prevent response updates"
ON public.popup_responses
FOR UPDATE
USING (false);

-- 3. Popup Displays: Prevent manipulation of display tracking
-- This ensures cooldown periods and max displays work correctly
CREATE POLICY "Prevent display deletion"
ON public.popup_displays
FOR DELETE
USING (false);

CREATE POLICY "Prevent display updates"
ON public.popup_displays
FOR UPDATE
USING (false);