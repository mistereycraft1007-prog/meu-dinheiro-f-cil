-- Add amount_received column to track partial payments
ALTER TABLE public.loans
ADD COLUMN amount_received NUMERIC NOT NULL DEFAULT 0;