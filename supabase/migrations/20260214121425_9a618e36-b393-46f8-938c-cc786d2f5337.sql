
-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loan_id UUID NOT NULL REFERENCES public.loans(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Allow all access (shared data between authenticated users)
CREATE POLICY "Authenticated users can do everything on transactions"
  ON public.transactions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update loans RLS: restrict to authenticated users only
DROP POLICY IF EXISTS "Permitir acesso total para todos" ON public.loans;

CREATE POLICY "Authenticated users can do everything on loans"
  ON public.loans
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
