# 🔧 Quick Login Troubleshooting

## 🚀 Quick Start

### Step 1: Access the Debug Tool

Navigate to: **http://localhost:5173/test-login**

This page will help you diagnose the login issue.

---

## 🎯 Most Common Issues (90% of cases)

### Issue 1: Email Confirmation Required ⭐ **MOST COMMON**

**Symptoms:** Can't login after registration

**Quick Fix:**

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Click your project
3. Go to **Authentication** → **Settings**
4. Scroll to **"Email Auth"** section
5. **UNCHECK** "Enable email confirmations"
6. Click **Save**

**OR** run this SQL in Supabase SQL Editor:

```sql
-- Confirm all emails (for development)
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;
```

---

### Issue 2: User Profile Missing ⭐ **SECOND MOST COMMON**

**Symptoms:** Login succeeds but then fails with "Failed to fetch user profile"

**Quick Fix:**

Run this in Supabase SQL Editor:

```sql
-- Sync auth users to users table
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
```

---

### Issue 3: RLS Policies Blocking Access

**Symptoms:** "permission denied for table users"

**Quick Fix (for development only):**

```sql
-- Temporarily disable RLS
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

**⚠️ Remember to re-enable RLS before production!**

---

## 📋 Step-by-Step Diagnosis

### Step 1: Test Supabase Connection

1. Go to http://localhost:5173/test-login
2. Click **"Test Connection"**
3. Check the result

**If fails:** Check your internet connection and `.env.local` file

---

### Step 2: Check Users Table

1. Click **"Check Users Table"**
2. See if any users exist

**If empty or error:** Run the table creation script from `DATABASE_SETUP_GUIDE.md`

---

### Step 3: Register a Test User

1. Enter email: `test@example.com`
2. Enter password: `password123`
3. Click **"Test Register"**

**If succeeds:** User is created, try logging in

**If fails:** Check the error message

---

### Step 4: Test Login

1. Use the same credentials from Step 3
2. Click **"Test Login"**

**If succeeds:** Login is working! The issue might be with the UI

**If fails:** Check the error message and apply the fixes above

---

## 🔍 Manual Checks

### Check 1: Verify Supabase Project is Active

1. Go to https://supabase.com/dashboard
2. Check if your project shows "Active" (not "Paused")
3. If paused, click "Resume"

---

### Check 2: Verify Environment Variables

Check your `.env.local` file:

```env
VITE_SUPABASE_URL=https://rnvsnsykwahipokdjgas.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Both values should be filled in and match your Supabase project.**

---

### Check 3: Browser Console

1. Open DevTools (F12)
2. Go to **Console** tab
3. Try to login
4. Look for red error messages

**Common errors:**
- `Invalid login credentials` → User doesn't exist or wrong password
- `Failed to fetch` → Network/connection issue
- `permission denied` → RLS policy issue

---

## 🛠️ Complete Fix Script

Run this in Supabase SQL Editor to fix all common issues:

```sql
-- 1. Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'vendor', 'admin')),
  address TEXT,
  joined_date TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  approval_status TEXT DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  store_name TEXT,
  store_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Sync auth users to users table
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

-- 3. Confirm all emails (for development)
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;

-- 4. Disable RLS temporarily (for testing)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 5. Verify everything
SELECT 
  'Auth Users' as type,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Profile Users' as type,
  COUNT(*) as count
FROM users;
```

---

## ✅ Success Checklist

After running the fixes, verify:

- [ ] Supabase project is active
- [ ] Users table exists
- [ ] At least one user exists in both `auth.users` and `users` tables
- [ ] Email confirmation is disabled (for development)
- [ ] RLS is disabled (for testing)
- [ ] Can register a new user
- [ ] Can login with registered user
- [ ] Redirects to correct dashboard based on role

---

## 🆘 Still Not Working?

### Get More Help

1. **Check the debug tool results** at `/test-login`
2. **Copy the error message** from browser console
3. **Run this query** and share the result:

```sql
SELECT 
  (SELECT COUNT(*) FROM auth.users) as auth_users,
  (SELECT COUNT(*) FROM users) as profile_users,
  (SELECT COUNT(*) FROM auth.users WHERE email_confirmed_at IS NULL) as unconfirmed_emails;
```

4. **Check if tables exist:**

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'products', 'orders');
```

---

## 🎯 Quick Test

Try this in your browser console (F12):

```javascript
// Test login directly
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'password123'
});

console.log('Login result:', { data, error });
```

---

## 📞 Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| "Invalid login credentials" | User doesn't exist or wrong password | Register first or check password |
| "Email not confirmed" | Email confirmation required | Disable in Supabase settings |
| "Failed to fetch user profile" | User in auth but not in users table | Run sync script above |
| "permission denied for table users" | RLS blocking access | Disable RLS temporarily |
| "Failed to fetch" | Network/connection issue | Check internet and Supabase status |
| "User creation failed" | Registration error | Check browser console for details |

---

## 🔄 Reset Everything

If you want to start fresh:

```sql
-- ⚠️ WARNING: This deletes all data!

-- Delete all users
DELETE FROM users;

-- Delete all auth users (be careful!)
-- You'll need to do this from Supabase Dashboard → Authentication → Users

-- Recreate tables
DROP TABLE IF EXISTS users CASCADE;
-- Then run the CREATE TABLE script from above
```

---

## ✨ After Fixing

Once login works:

1. **Re-enable email confirmation** (if needed for production)
2. **Re-enable RLS** with proper policies
3. **Test all user roles** (customer, vendor, admin)
4. **Remove the test page** (`/test-login`) before production

---

**Most issues are fixed by disabling email confirmation and syncing auth users to the users table!**
