-- ============================================
-- FIX RLS POLICIES FOR TECHNEST
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Drop all existing policies on users table
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Anyone can register" ON users;
DROP POLICY IF EXISTS "Allow all for testing" ON users;

-- 2. Temporarily disable RLS for initial setup
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 3. Create permissive policies for development

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for registration)
CREATE POLICY "Enable insert for registration"
  ON users FOR INSERT
  WITH CHECK (true);

-- Allow users to read their own data
CREATE POLICY "Enable read for own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Enable update for own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Allow service role to do everything (for server-side operations)
CREATE POLICY "Enable all for service role"
  ON users FOR ALL
  USING (auth.role() = 'service_role');

-- 4. For development: Add a permissive read policy
-- ⚠️ REMOVE THIS IN PRODUCTION!
CREATE POLICY "Enable read for authenticated users (dev only)"
  ON users FOR SELECT
  USING (auth.role() = 'authenticated');

-- 5. Verify policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'users';

-- 6. Test query (should work now)
SELECT id, email, name, role FROM users LIMIT 5;
