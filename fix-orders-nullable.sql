-- Make customer_id and vendor_id nullable in orders table
ALTER TABLE public.orders 
ALTER COLUMN customer_id DROP NOT NULL;

ALTER TABLE public.orders 
ALTER COLUMN vendor_id DROP NOT NULL;
