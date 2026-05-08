-- Drop existing policies on orders table
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Vendors can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

-- Allow anyone (authenticated or not) to create orders
CREATE POLICY "Anyone can create orders" ON public.orders
FOR INSERT 
WITH CHECK (true);

-- Allow users to view their own orders (if they have a customer_id)
CREATE POLICY "Users can view their own orders" ON public.orders
FOR SELECT 
USING (
  auth.uid() = customer_id 
  OR customer_id IS NULL
  OR auth.role() = 'authenticated'
);

-- Allow authenticated users to view all orders (for vendors and admins)
CREATE POLICY "Authenticated users can view all orders" ON public.orders
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Allow authenticated users to update order status
CREATE POLICY "Authenticated users can update orders" ON public.orders
FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
