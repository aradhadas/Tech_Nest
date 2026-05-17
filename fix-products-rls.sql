-- Drop existing policies on products table
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;

-- Allow anyone to view products
CREATE POLICY "Anyone can view products" ON public.products
FOR SELECT 
USING (true);

-- Allow anyone to insert products (for development - no auth required)
CREATE POLICY "Anyone can insert products" ON public.products
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update products (for development - no auth required)
CREATE POLICY "Anyone can update products" ON public.products
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Allow anyone to delete products (for development - no auth required)
CREATE POLICY "Anyone can delete products" ON public.products
FOR DELETE 
USING (true);
