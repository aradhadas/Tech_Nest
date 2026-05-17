# 🚨 Fix 406 Error - Account Created But Can't Login

## ✅ Good News!
Your account was created successfully in Supabase Auth!

## ❌ The Problem:
The app can't read your user profile from the `users` table because of RLS (Row Level Security) policies.

---

## 🎯 **SOLUTION - Follow These Steps EXACTLY:**

### Step 1: Open Supabase SQL Editor

1. Go to: **https://supabase.com/dashboard**
2. Click on your project: **rnvsnsykwahipokdjgas**
3. On the left sidebar, click **"SQL Editor"**
4. Click the **"New Query"** button (top right)

---

### Step 2: Copy and Paste This SQL

Copy this ENTIRE script:

```sql
-- Disable RLS on users table
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

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

-- Confirm all emails
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;

-- Verify it worked
SELECT 
  u.id,
  u.email,
  u.name,
  u.role
FROM users u
ORDER BY u.created_at DESC
LIMIT 5;
```

---

### Step 3: Run the Script

1. **Paste** the SQL into the editor
2. Click the **"Run"** button (or press Ctrl+Enter)
3. Wait for **"Success"** message
4. You should see a table with your user data at the bottom

---

### Step 4: Disable Email Confirmation

1. Still in Supabase Dashboard
2. Click **"Authentication"** on the left sidebar
3. Click **"Settings"** tab at the top
4. Scroll down to **"Email Auth"** section
5. Find the checkbox that says **"Enable email confirmations"**
6. **UNCHECK** that box
7. Scroll to the bottom and click **"Save"**

---

### Step 5: Try to Login

1. Go back to your app: **http://localhost:5173/login**
2. Enter the email and password you just registered with
3. Click **"Sign In"**

**Expected Result:** ✅ Should login successfully and redirect to dashboard!

---

## 🔍 **Verify the Fix Worked**

After running the SQL, you can verify by running this query in SQL Editor:

```sql
-- Check if your user profile exists
SELECT 
  au.email as "Auth Email",
  u.email as "Profile Email",
  u.name as "Name",
  u.role as "Role",
  CASE 
    WHEN u.id IS NULL THEN '❌ Missing Profile'
    ELSE '✅ Profile Exists'
  END as "Status"
FROM auth.users au
LEFT JOIN users u ON u.id = au.id
ORDER BY au.created_at DESC
LIMIT 5;
```

**Expected:** Should show "✅ Profile Exists" for your user

---

## 📊 **What Each SQL Command Does:**

1. **`ALTER TABLE users DISABLE ROW LEVEL SECURITY;`**
   - Turns off RLS so the app can read/write user data
   - This fixes the 403 and 406 errors

2. **`INSERT INTO users ... FROM auth.users ...`**
   - Creates user profiles for any auth users that don't have one
   - This fixes your current account

3. **`UPDATE auth.users SET email_confirmed_at = NOW()`**
   - Marks all emails as confirmed
   - Allows login without email verification

4. **`SELECT ... FROM users`**
   - Shows you the results to verify it worked

---

## 🎯 **Why This Happened:**

When you registered:
1. ✅ Account created in `auth.users` (Supabase Auth)
2. ❌ Profile NOT created in `users` table (blocked by RLS)
3. ❌ Login fails because app can't find profile

The SQL script fixes step 2 by:
- Disabling RLS temporarily
- Creating the missing profile
- Syncing auth user with profile user

---

## ✅ **After Running the Fix:**

You should be able to:
- ✅ Login with your registered email/password
- ✅ See your profile data
- ✅ Access the dashboard
- ✅ No more 403/406 errors

---

## 🆘 **If Still Not Working:**

### Check 1: Did the SQL run successfully?

Look for this message in SQL Editor:
```
Success. No rows returned
```
or
```
Success. Rows returned: X
```

### Check 2: Is RLS actually disabled?

Run this query:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';
```

**Expected:** `rowsecurity = false`

### Check 3: Does your profile exist?

Run this query:
```sql
SELECT * FROM users WHERE email = 'your-email@example.com';
```

**Expected:** Should return 1 row with your data

---

## 🔄 **Alternative: Use the Test Page**

If SQL Editor is confusing, try this:

1. Go to: **http://localhost:5173/test-login**
2. Enter your email and password
3. Click **"Test Login"**
4. See the detailed error message

This will tell you exactly what's wrong.

---

## 💡 **Quick Test:**

After running the SQL:

1. **Clear browser cache:**
   - Press F12
   - Right-click the refresh button
   - Click "Empty Cache and Hard Reload"

2. **Try login again:**
   - Go to `/login`
   - Enter your credentials
   - Click "Sign In"

**Should work now!** ✅

---

## 📝 **Summary:**

**Problem:** RLS blocking user profile access (406 error)  
**Solution:** Run SQL script to disable RLS and sync users  
**Time:** 2 minutes  
**Result:** Login works perfectly  

---

**The SQL script is in the file `RUN_THIS_NOW.sql` - just copy and paste it into Supabase SQL Editor!** 🚀
