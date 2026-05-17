# 🔍 Login Issue Debug Guide

## Quick Diagnosis Steps

### Step 1: Check Browser Console

1. Open your browser's Developer Tools (F12)
2. Go to the **Console** tab
3. Try to login
4. Look for any error messages

**Common errors and solutions:**

#### Error: "Invalid login credentials"
- **Cause:** User doesn't exist or wrong password
- **Solution:** Register a new user first, or check password

#### Error: "Failed to fetch user profile"
- **Cause:** User exists in Supabase Auth but not in `users` table
- **Solution:** Run the SQL fix below

#### Error: "Network error" or "Failed to fetch"
- **Cause:** Supabase connection issue
- **Solution:** Check your internet connection and Supabase project status

---

## Step 2: Verify Supabase Connection

Run this test in your browser console (F12):

```javascript
// Test Supabase connection
fetch('https://rnvsnsykwahipokdjgas.supabase.co/rest/v1/', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJudnNuc3lrd2FoaXBva2RqZ2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwODA4NTYsImV4cCI6MjA5MzY1Njg1Nn0.kdvJWmmgC2fCtPzw9sIdbvxjDDjq4Iyu5Lg-KJ4pLvw'
  }
})
.then(r => r.json())
.then(d => console.log('✅ Supabase connected:', d))
.catch(e => console.error('❌ Supabase error:', e));
```

**Expected result:** Should see `✅ Supabase connected:` with some data

---

## Step 3: Check if Users Table Exists

Go to your Supabase Dashboard → SQL Editor and run:

```sql
-- Check if users table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'users';
```

**Expected result:** Should return one row with `table_name = 'users'`

**If empty:** You need to create the users table. See `DATABASE_SETUP_GUIDE.md`

---

## Step 4: Check if You Have Any Users

```sql
-- Check existing users
SELECT id, email, name, role, approval_status 
FROM users 
LIMIT 10;
```

**Expected result:** Should show your registered users

**If empty:** You need to register a user first

---

## Step 5: Test Login with SQL

Try to verify your credentials directly in Supabase:

```sql
-- Check if user exists in auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'your-email@example.com';
```

**Expected result:** Should show your user

**If empty:** User doesn't exist in Supabase Auth - you need to register

---

## Common Issues & Solutions

### Issue 1: "User exists in auth.users but not in public.users"

**Symptoms:**
- Login shows "Failed to fetch user profile"
- Console shows error fetching from users table

**Solution:**
```sql
-- Manually create user profile
INSERT INTO users (id, name, email, role, status, approval_status)
SELECT 
  id,
  email as name,  -- Temporary, user can update later
  email,
  'customer' as role,
  'active' as status,
  'approved' as approval_status
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (id) DO NOTHING;
```

---

### Issue 2: "Email confirmation required"

**Symptoms:**
- Can't login after registration
- Supabase says "Email not confirmed"

**Solution:**

**Option A: Disable email confirmation (for development)**
1. Go to Supabase Dashboard
2. Authentication → Settings
3. Scroll to "Email Auth"
4. **Disable** "Enable email confirmations"
5. Save

**Option B: Confirm email manually**
```sql
-- Manually confirm user email
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'your-email@example.com';
```

---

### Issue 3: "RLS policies blocking access"

**Symptoms:**
- Login succeeds but can't fetch user data
- Console shows "permission denied for table users"

**Solution:**
```sql
-- Temporarily disable RLS for testing
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Or add a permissive policy
CREATE POLICY "Allow all for testing"
  ON users FOR ALL
  USING (true)
  WITH CHECK (true);
```

**⚠️ Remember to re-enable RLS and remove this policy in production!**

---

### Issue 4: "Password too weak"

**Symptoms:**
- Registration fails with "Password should be at least 6 characters"

**Solution:**
- Use a password with at least 6 characters
- Or change Supabase password requirements:
  1. Supabase Dashboard → Authentication → Settings
  2. Scroll to "Password Requirements"
  3. Adjust minimum length

---

## Step-by-Step Login Test

### Test 1: Register a New User

1. Go to `/register`
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Phone: 1234567890
   - Password: password123
   - Role: Customer
3. Click "Create Account"

**Expected:** Should redirect to `/customer/home`

**If fails:** Check browser console for errors

---

### Test 2: Login with Registered User

1. Go to `/login`
2. Enter:
   - Email: test@example.com
   - Password: password123
3. Click "Sign In"

**Expected:** Should redirect to `/customer/home`

**If fails:** Check browser console for errors

---

### Test 3: Check User in Database

```sql
-- Verify user was created
SELECT * FROM users WHERE email = 'test@example.com';
```

**Expected:** Should show the user with all fields populated

---

## Quick Fix Script

If you're having issues, run this in Supabase SQL Editor:

```sql
-- 1. Check if users table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'users'
) as users_table_exists;

-- 2. If false, create the table
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

-- 3. Sync any auth users that don't have profiles
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

-- 4. Confirm all emails (for development only)
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;

-- 5. Disable RLS temporarily (for testing)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 6. Verify
SELECT 
  au.email,
  au.email_confirmed_at,
  u.name,
  u.role,
  u.status
FROM auth.users au
LEFT JOIN users u ON u.id = au.id
LIMIT 10;
```

---

## Enable Debug Logging

Add this to your `src/contexts/AuthContext.tsx` temporarily:

```typescript
const login = useCallback(async (
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔐 Attempting login for:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('📧 Auth response:', { data, error });

    if (error) throw error;
    if (!data.user) throw new Error('Login failed');

    console.log('👤 Fetching user profile for:', data.user.id);
    await fetchUserProfile(data.user);
    
    console.log('✅ Login successful');
    return { success: true };
  } catch (error) {
    console.error('❌ Login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    };
  }
}, [fetchUserProfile]);
```

---

## Test Credentials

If you want to test with demo accounts, first create them:

### Create Demo Users via SQL

```sql
-- Note: You need to register these users through the app first
-- Or use Supabase Dashboard → Authentication → Users → Add User

-- Then update their profiles:
UPDATE users 
SET role = 'admin', approval_status = 'approved'
WHERE email = 'admin@demo.com';

UPDATE users 
SET role = 'vendor', approval_status = 'approved', 
    store_name = 'Demo Vendor Store',
    store_description = 'A demo vendor store'
WHERE email = 'vendor@demo.com';

UPDATE users 
SET role = 'customer', approval_status = 'approved'
WHERE email = 'customer@demo.com';
```

---

## Still Not Working?

### Check These:

1. **Is your dev server running?**
   ```bash
   npm run dev
   ```

2. **Is Supabase project active?**
   - Go to https://supabase.com/dashboard
   - Check if your project is running (not paused)

3. **Are you using the correct URL?**
   - Check `.env.local` has correct `VITE_SUPABASE_URL`
   - Should match your Supabase project URL

4. **Clear browser cache and localStorage**
   ```javascript
   // Run in browser console
   localStorage.clear();
   location.reload();
   ```

5. **Check Network tab**
   - Open DevTools → Network tab
   - Try to login
   - Look for failed requests (red)
   - Click on them to see error details

---

## Get Help

If still stuck, provide these details:

1. **Error message from browser console**
2. **Result of this SQL query:**
   ```sql
   SELECT COUNT(*) as auth_users FROM auth.users;
   SELECT COUNT(*) as profile_users FROM users;
   ```
3. **Screenshot of Network tab showing failed request**
4. **Your Supabase project region** (from dashboard)

---

## Quick Test Command

Run this in your browser console after trying to login:

```javascript
// Check auth state
supabase.auth.getSession().then(({data}) => {
  console.log('Session:', data.session);
  if (data.session) {
    console.log('✅ Logged in as:', data.session.user.email);
  } else {
    console.log('❌ Not logged in');
  }
});
```

---

## Most Common Solution

**90% of login issues are caused by:**

1. **Email not confirmed** → Disable email confirmation in Supabase settings
2. **User in auth.users but not in public.users** → Run the sync script above
3. **RLS policies blocking access** → Temporarily disable RLS for testing

Try these three fixes first!
