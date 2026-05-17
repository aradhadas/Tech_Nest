-- ============================================
-- COPY THIS ENTIRE SCRIPT
-- PASTE INTO SUPABASE SQL EDITOR
-- CLICK "RUN"
-- ============================================

-- 1. Disable RLS on users table
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. Sync auth users to users table (this fixes your current issue)
INSERT INTO users (id, name, email, role, status, approval_status)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'name', au.email) as name,
  au.email,
  'customer' as role,
  'active' as status,
  'approved' as approval_status
FROM auth.users au
LEFT JOIN users u ON u.id = au.id
WHERE u.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 3. Confirm all emails
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;

-- 4. Verify it worked
SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  'Profile exists' as status
FROM users u
ORDER BY u.created_at DESC
LIMIT 5;

-- ============================================
-- DONE! Now try to login
-- ============================================
