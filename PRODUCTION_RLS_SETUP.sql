-- ============================================
-- PRODUCTION RLS POLICIES FOR TECHNEST
-- Run this BEFORE deploying to production
-- ============================================

-- Step 1: Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Policy 1: Anyone can insert (for registration)
CREATE POLICY "users_insert_policy"
  ON users FOR INSERT
  WITH CHECK (true);

-- Policy 2: Users can read their own data
CREATE POLICY "users_select_own"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Policy 3: Users can update their own data
CREATE POLICY "users_update_own"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 4: Admins can read all users
CREATE POLICY "users_select_admin"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy 5: Admins can update all users
CREATE POLICY "users_update_admin"
  ON users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- PRODUCTS TABLE POLICIES
-- ============================================

-- Policy 1: Everyone can read active products
CREATE POLICY "products_select_active"
  ON products FOR SELECT
  USING (status = 'active' OR vendor_id = auth.uid());

-- Policy 2: Vendors can insert their own products
CREATE POLICY "products_insert_vendor"
  ON products FOR INSERT
  WITH CHECK (
    vendor_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() 
      AND role = 'vendor'
      AND approval_status = 'approved'
    )
  );

-- Policy 3: Vendors can update their own products
CREATE POLICY "products_update_vendor"
  ON products FOR UPDATE
  USING (vendor_id = auth.uid())
  WITH CHECK (vendor_id = auth.uid());

-- Policy 4: Admins can do everything with products
CREATE POLICY "products_admin_all"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- ORDERS TABLE POLICIES
-- ============================================

-- Policy 1: Anyone can insert orders (for guest checkout)
CREATE POLICY "orders_insert_all"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Policy 2: Customers can read their own orders
CREATE POLICY "orders_select_customer"
  ON orders FOR SELECT
  USING (customer_id = auth.uid());

-- Policy 3: Vendors can read their orders
CREATE POLICY "orders_select_vendor"
  ON orders FOR SELECT
  USING (vendor_id = auth.uid());

-- Policy 4: Vendors can update their orders
CREATE POLICY "orders_update_vendor"
  ON orders FOR UPDATE
  USING (vendor_id = auth.uid())
  WITH CHECK (vendor_id = auth.uid());

-- Policy 5: Admins can read all orders
CREATE POLICY "orders_select_admin"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy 6: Admins can update all orders
CREATE POLICY "orders_update_admin"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- VERIFY POLICIES
-- ============================================

-- Check all policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('users', 'products', 'orders')
ORDER BY tablename, policyname;

-- ============================================
-- TEST POLICIES (Run as different users)
-- ============================================

-- Test 1: Can I read my own user data?
SELECT * FROM users WHERE id = auth.uid();

-- Test 2: Can I read active products?
SELECT * FROM products WHERE status = 'active' LIMIT 5;

-- Test 3: Can I read my own orders?
SELECT * FROM orders WHERE customer_id = auth.uid() LIMIT 5;

-- ============================================
-- DONE! RLS is now properly configured
-- ============================================
