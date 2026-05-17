-- ============================================
-- QUICK FIX FOR LOGIN ISSUES
-- Copy and paste this entire script into Supabase SQL Editor
-- ============================================

-- Step 1: Disable RLS on users table (for development)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Step 2: Confirm all existing emails
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;

-- Step 3: Sync any auth users that don't have profiles
INSERT INTO users (id, name, email, role, status, approval_status)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'name', au.email) as name,
  au.email,
  COALESCE(au.raw_user_meta_data->>'role', 'customer') as role,
  'active' as status,
  'approved' as approval_status
FROM auth.users au
LEFT JOIN users u ON u.id = au.id
WHERE u.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Step 4: Verify the fix
SELECT 
  'Auth Users' as type,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Profile Users' as type,
  COUNT(*) as count
FROM users
UNION ALL
SELECT 
  'Unconfirmed Emails' as type,
  COUNT(*) as count
FROM auth.users
WHERE email_confirmed_at IS NULL;

-- Step 5: Show all users
SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  u.status,
  u.approval_status,
  au.email_confirmed_at
FROM users u
LEFT JOIN auth.users au ON au.id = u.id
ORDER BY u.created_at DESC
LIMIT 10;

-- ============================================
-- SUCCESS! Now try to:
-- 1. Register a new user with password 6+ characters
-- 2. Login with that user
-- ============================================
