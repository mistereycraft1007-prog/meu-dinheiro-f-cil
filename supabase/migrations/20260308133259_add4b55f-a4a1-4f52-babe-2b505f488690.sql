
-- Drop the current permissive user self-update policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Recreate with restriction: users cannot change is_blocked
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND is_blocked = (SELECT p.is_blocked FROM public.profiles p WHERE p.user_id = auth.uid())
);
