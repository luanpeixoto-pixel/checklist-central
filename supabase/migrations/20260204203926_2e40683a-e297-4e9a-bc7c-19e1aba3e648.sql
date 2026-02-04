-- Drop existing public policies on popup_definitions
DROP POLICY IF EXISTS "Anyone can view active popups" ON popup_definitions;

-- Create new policy requiring authentication
CREATE POLICY "Authenticated users can view active popups" 
ON popup_definitions 
FOR SELECT 
USING (is_active = true AND auth.uid() IS NOT NULL);

-- Drop existing public policies on popup_triggers
DROP POLICY IF EXISTS "Anyone can view active triggers" ON popup_triggers;

-- Create new policy requiring authentication
CREATE POLICY "Authenticated users can view active triggers" 
ON popup_triggers 
FOR SELECT 
USING (is_active = true AND auth.uid() IS NOT NULL);