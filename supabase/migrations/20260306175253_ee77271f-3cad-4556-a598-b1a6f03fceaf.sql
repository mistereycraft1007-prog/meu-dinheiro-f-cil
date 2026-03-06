
ALTER TABLE public.transactions ALTER COLUMN loan_id DROP NOT NULL;
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_loan_id_fkey;
ALTER TABLE public.transactions ADD CONSTRAINT transactions_loan_id_fkey 
  FOREIGN KEY (loan_id) REFERENCES public.loans(id) ON DELETE SET NULL;
