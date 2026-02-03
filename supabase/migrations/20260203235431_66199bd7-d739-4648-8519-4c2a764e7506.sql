-- Drop existing UPDATE policies
DROP POLICY IF EXISTS "Users can update their own checklists" ON public.checklists;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Recreate UPDATE policy for checklists with USING and WITH CHECK
CREATE POLICY "Users can update their own checklists" 
ON public.checklists 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Recreate UPDATE policy for profiles with USING and WITH CHECK
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);