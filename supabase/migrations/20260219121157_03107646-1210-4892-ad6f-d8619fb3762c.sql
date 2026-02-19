
-- Drop ALL existing policies on loans (using pattern match approach)
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'loans' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.loans', pol.policyname);
  END LOOP;
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'transactions' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.transactions', pol.policyname);
  END LOOP;
END $$;

-- Recreate as PERMISSIVE policies for loans
CREATE POLICY "loans_select" ON public.loans FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "loans_insert" ON public.loans FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "loans_update" ON public.loans FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "loans_delete" ON public.loans FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Recreate as PERMISSIVE policies for transactions
CREATE POLICY "transactions_select" ON public.transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "transactions_insert" ON public.transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "transactions_update" ON public.transactions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "transactions_delete" ON public.transactions FOR DELETE TO authenticated USING (auth.uid() = user_id);
