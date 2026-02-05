-- Allow authenticated users to manage popup_definitions
CREATE POLICY "Authenticated users can insert popups" 
ON public.popup_definitions 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update popups" 
ON public.popup_definitions 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete popups" 
ON public.popup_definitions 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to manage popup_triggers
CREATE POLICY "Authenticated users can insert triggers" 
ON public.popup_triggers 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update triggers" 
ON public.popup_triggers 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete triggers" 
ON public.popup_triggers 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Also allow viewing all popups (not just active ones) for admin
DROP POLICY IF EXISTS "Authenticated users can view active popups" ON public.popup_definitions;
CREATE POLICY "Authenticated users can view all popups" 
ON public.popup_definitions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can view active triggers" ON public.popup_triggers;
CREATE POLICY "Authenticated users can view all triggers" 
ON public.popup_triggers 
FOR SELECT 
USING (auth.uid() IS NOT NULL);