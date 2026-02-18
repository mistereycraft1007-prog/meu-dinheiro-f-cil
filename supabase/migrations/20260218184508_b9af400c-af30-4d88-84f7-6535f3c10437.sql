
-- Add user_id to loans
ALTER TABLE public.loans ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to transactions
ALTER TABLE public.transactions ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop old permissive policies
DROP POLICY IF EXISTS "Authenticated users can do everything on loans" ON public.loans;
DROP POLICY IF EXISTS "Authenticated users can do everything on transactions" ON public.transactions;
DROP POLICY IF EXISTS "Permitir acesso total para todos" ON public.loans;
DROP POLICY IF EXISTS "Permitir acesso total para todos" ON public.transactions;

-- Create secure RLS policies for loans
CREATE POLICY "Users can view their own loans"
ON public.loans FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own loans"
ON public.loans FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own loans"
ON public.loans FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own loans"
ON public.loans FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create secure RLS policies for transactions
CREATE POLICY "Users can view their own transactions"
ON public.transactions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
ON public.transactions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
ON public.transactions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
ON public.transactions FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
