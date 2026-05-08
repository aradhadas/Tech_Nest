# 🔧 Troubleshooting Guide

## Common Issues and Solutions

---

## 🚫 Environment & Setup Issues

### Issue: "Missing Supabase environment variables"

**Error Message:**
```
Error: Missing Supabase environment variables. Please check your .env.local file.
```

**Solution:**
1. Check if `.env.local` exists in project root
2. Verify it contains:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```
3. Restart dev server: `npm run dev`
4. Clear browser cache and reload

**How to verify:**
```bash
# Check if file exists
ls -la .env.local

# Check file contents (be careful not to share these!)
cat .env.local
```

---

### Issue: Environment variables not loading

**Symptoms:**
- `import.meta.env.VITE_SUPABASE_URL` is undefined
- Console shows "undefined" for env variables

**Solution:**
1. Ensure variable names start with `VITE_`
2. Restart dev server (Vite only loads env on startup)
3. Check for typos in variable names
4. Ensure no spaces around `=` in `.env.local`

**Correct format:**
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
```

**Incorrect format:**
```env
VITE_SUPABASE_URL = https://xxxxx.supabase.co  ❌ (spaces)
SUPABASE_URL=https://xxxxx.supabase.co         ❌ (no VITE_ prefix)
```

---

## 🗄️ Database Issues

### Issue: "Row Level Security policy violation"

**Error Message:**
```
Error: new row violates row-level security policy for table "products"
```

**Cause:** RLS policies are blocking your operation

**Solution:**
1. Check if you're logged in (for INSERT/UPDATE/DELETE)
2. Verify RLS policies in Supabase dashboard:
   - Go to **Database** → **Tables** → Select table → **Policies**
3. For testing, you can temporarily disable RLS:
   ```sql
   ALTER TABLE products DISABLE ROW LEVEL SECURITY;
   ```
   ⚠️ **Don't do this in production!**

4. Re-enable and fix policies:
   ```sql
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;
   ```

---

### Issue: Products not loading

**Symptoms:**
- Empty product list
- Loading spinner never stops
- No error messages

**Solution:**

1. **Check if products exist in database:**
   - Go to Supabase dashboard
   - **Database** → **Table Editor** → `products`
   - Should see 40 products

2. **If no products, run migration:**
   ```bash
   npx tsx scripts/migrate-to-supabase.ts
   ```

3. **Check browser console for errors:**
   - Press F12 → Console tab
   - Look for red error messages

4. **Check network requests:**
   - Press F12 → Network tab
   - Look for failed requests to Supabase
   - Check response for error details

5. **Verify RLS policies allow SELECT:**
   ```sql
   -- This policy should exist
   CREATE POLICY "Anyone can view active products" ON products
     FOR SELECT USING (status = 'active');
   ```

---

### Issue: "relation 'products' does not exist"

**Error Message:**
```
Error: relation "public.products" does not exist
```

**Cause:** Database tables not created

**Solution:**
1. Go to Supabase dashboard → **SQL Editor**
2. Run all SQL scripts from `SUPABASE_SETUP_GUIDE.md` Phase 2
3. Verify tables exist:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
4. Should see: `users`, `categories`, `products`, `orders`

---

## 🖼️ Storage & Image Issues

### Issue: Images not displaying

**Symptoms:**
- Broken image icons
- 404 errors in console
- Images show placeholder

**Solution:**

1. **Check if images uploaded:**
   - Go to Supabase dashboard
   - **Storage** → `product-images` bucket
   - Should see 14 images

2. **If no images, run migration:**
   ```bash
   npx tsx scripts/migrate-to-supabase.ts
   ```

3. **Check bucket is public:**
   - **Storage** → `product-images` → **Settings**
   - "Public bucket" should be enabled

4. **Check image URLs in database:**
   ```sql
   SELECT id, name, image_url FROM products LIMIT 5;
   ```
   - URLs should look like: `https://xxxxx.supabase.co/storage/v1/object/public/product-images/led-1.jpg`

5. **Test image URL directly:**
   - Copy an image URL from database
   - Paste in browser address bar
   - Should display the image

---

### Issue: "Storage bucket not found"

**Error Message:**
```
Error: Bucket not found
```

**Solution:**
1. Go to Supabase dashboard → **Storage**
2. Click "Create a new bucket"
3. Name: `product-images`
4. Make it **Public**
5. Click "Create bucket"
6. Set policies from `SUPABASE_SETUP_GUIDE.md` Phase 3

---

### Issue: CORS errors with images

**Error Message:**
```
Access to image blocked by CORS policy
```

**Solution:**
1. Ensure bucket is public
2. Check storage policies allow public read:
   ```sql
   CREATE POLICY "Public can view product images"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'product-images');
   ```
3. Clear browser cache
4. Try incognito/private window

---

## 🔐 Authentication Issues

### Issue: Registration not working

**Symptoms:**
- "User already exists" error
- No error but user not created
- Email confirmation required

**Solution:**

1. **Check if email already exists:**
   - Go to Supabase dashboard
   - **Authentication** → **Users**
   - Search for email

2. **Check email confirmation settings:**
   - **Authentication** → **Settings** → **Email Auth**
   - For development, disable "Confirm email"
   - For production, keep it enabled

3. **Check user profile created:**
   ```sql
   SELECT * FROM public.users WHERE email = 'test@example.com';
   ```

4. **If auth user exists but no profile:**
   ```sql
   -- Get auth user ID
   SELECT id FROM auth.users WHERE email = 'test@example.com';
   
   -- Manually create profile
   INSERT INTO public.users (id, name, email, role, status)
   VALUES ('user-id-here', 'Test User', 'test@example.com', 'customer', 'active');
   ```

---

### Issue: Login not working

**Symptoms:**
- "Invalid login credentials" error
- Correct password but can't login

**Solution:**

1. **Check email confirmation:**
   - Go to **Authentication** → **Users**
   - Check if email is confirmed
   - If not, click "..." → "Confirm email"

2. **Reset password:**
   ```typescript
   await supabase.auth.resetPasswordForEmail('user@example.com');
   ```

3. **Check user exists:**
   ```sql
   SELECT * FROM auth.users WHERE email = 'user@example.com';
   ```

4. **For development, create test user:**
   - Go to **Authentication** → **Users**
   - Click "Add user"
   - Enter email and password
   - Disable "Auto Confirm User" for testing

---

### Issue: User session not persisting

**Symptoms:**
- User logged out on page refresh
- Session lost after closing browser

**Solution:**

1. **Check localStorage:**
   - Press F12 → Application tab → Local Storage
   - Should see `supabase.auth.token`

2. **Check session in code:**
   ```typescript
   const { data: { session } } = await supabase.auth.getSession();
   console.log('Session:', session);
   ```

3. **Ensure AuthProvider wraps app:**
   ```typescript
   // main.tsx
   <AuthProvider>
     <App />
   </AuthProvider>
   ```

4. **Check for auth state listener:**
   ```typescript
   useEffect(() => {
     const { data: { subscription } } = supabase.auth.onAuthStateChange(
       (_event, session) => {
         console.log('Auth state changed:', session);
       }
     );
     return () => subscription.unsubscribe();
   }, []);
   ```

---

## 🔄 Migration Issues

### Issue: Migration script fails

**Error Message:**
```
❌ Migration failed: ...
```

**Solution:**

1. **Check environment variables:**
   ```bash
   # Verify .env.local exists and has correct values
   cat .env.local
   ```

2. **Check image files exist:**
   ```bash
   ls -la public/products/
   # Should see 14 .jpg files
   ```

3. **Check Supabase connection:**
   ```bash
   # Test with a simple query
   npx tsx -e "
   import { createClient } from '@supabase/supabase-js';
   const supabase = createClient(
     process.env.VITE_SUPABASE_URL,
     process.env.VITE_SUPABASE_ANON_KEY
   );
   const { data, error } = await supabase.from('categories').select('*');
   console.log('Categories:', data, error);
   "
   ```

4. **Run migration with verbose logging:**
   - Edit `scripts/migrate-to-supabase.ts`
   - Add more `console.log()` statements
   - Re-run script

---

### Issue: Some images uploaded, some failed

**Symptoms:**
```
📊 Upload Summary: 10 succeeded, 4 failed
```

**Solution:**

1. **Check failed image names in output**
2. **Verify image files exist:**
   ```bash
   ls -la public/products/led-1.jpg
   ```
3. **Check file permissions:**
   ```bash
   chmod 644 public/products/*.jpg
   ```
4. **Re-run migration (it will skip existing files)**

---

## 🌐 Network & API Issues

### Issue: "Failed to fetch" errors

**Symptoms:**
- All API calls fail
- Network errors in console
- Can't connect to Supabase

**Solution:**

1. **Check internet connection**

2. **Verify Supabase project is running:**
   - Go to Supabase dashboard
   - Check project status (should be green)

3. **Check Supabase URL is correct:**
   ```typescript
   console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
   // Should be: https://xxxxx.supabase.co
   ```

4. **Check for firewall/proxy issues:**
   - Try from different network
   - Disable VPN temporarily
   - Check corporate firewall settings

5. **Test Supabase directly:**
   ```bash
   curl https://your-project.supabase.co/rest/v1/
   ```

---

### Issue: Slow API responses

**Symptoms:**
- Products take long to load
- Images load slowly
- App feels sluggish

**Solution:**

1. **Check Supabase region:**
   - Choose region closest to users
   - Can't change after creation (need new project)

2. **Add loading states:**
   ```typescript
   if (loading) return <div>Loading...</div>;
   ```

3. **Implement caching:**
   ```typescript
   // Use React Query or SWR
   import { useQuery } from '@tanstack/react-query';
   
   const { data: products } = useQuery({
     queryKey: ['products'],
     queryFn: fetchProducts,
     staleTime: 5 * 60 * 1000, // 5 minutes
   });
   ```

4. **Optimize images:**
   - Compress images before upload
   - Use appropriate image sizes
   - Consider lazy loading

---

## 🐛 React & Frontend Issues

### Issue: "useAuth must be used within AuthProvider"

**Error Message:**
```
Error: useAuth must be used within AuthProvider
```

**Solution:**

1. **Check AuthProvider wraps component:**
   ```typescript
   // main.tsx
   <AuthProvider>
     <App />
   </AuthProvider>
   ```

2. **Check import path:**
   ```typescript
   import { useAuth } from '@/contexts/AuthContext';
   // Not: import { useAuth } from './AuthContext';
   ```

3. **Verify AuthProvider is exported:**
   ```typescript
   export function AuthProvider({ children }) { ... }
   ```

---

### Issue: Infinite re-renders

**Symptoms:**
- Browser freezes
- "Maximum update depth exceeded" error
- Console flooded with logs

**Solution:**

1. **Check useEffect dependencies:**
   ```typescript
   // Bad - missing dependencies
   useEffect(() => {
     fetchProducts();
   }, []); // ❌ fetchProducts not in deps
   
   // Good - proper dependencies
   useEffect(() => {
     fetchProducts();
   }, [fetchProducts]); // ✅
   
   // Or use useCallback
   const fetchProducts = useCallback(async () => {
     // ...
   }, []);
   ```

2. **Check state updates in render:**
   ```typescript
   // Bad - setState in render
   function Component() {
     setState(value); // ❌ Causes infinite loop
     return <div>...</div>;
   }
   
   // Good - setState in useEffect
   function Component() {
     useEffect(() => {
       setState(value); // ✅
     }, []);
     return <div>...</div>;
   }
   ```

---

## 🔍 Debugging Tips

### Enable Supabase Debug Logging

```typescript
// src/lib/supabase.ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    debug: true, // Enable auth debug logs
  },
});
```

### Check Supabase Logs

1. Go to Supabase dashboard
2. **Logs** → **API Logs**
3. Filter by status code (400, 500, etc.)
4. Check error messages

### Use Browser DevTools

```typescript
// Add breakpoints
debugger;

// Log everything
console.log('User:', user);
console.log('Products:', products);
console.log('Error:', error);

// Check network requests
// F12 → Network tab → Filter by "supabase"
```

### Test Queries Directly

```typescript
// Test in browser console
const { data, error } = await supabase
  .from('products')
  .select('*')
  .limit(5);
console.log('Data:', data);
console.log('Error:', error);
```

---

## 📞 Getting Help

### Before Asking for Help

1. ✅ Check this troubleshooting guide
2. ✅ Check browser console for errors
3. ✅ Check Supabase dashboard logs
4. ✅ Check network tab for failed requests
5. ✅ Try in incognito/private window
6. ✅ Clear browser cache and localStorage

### Information to Provide

When asking for help, include:
- Error message (full text)
- Browser console logs
- Network request details
- Steps to reproduce
- What you've already tried

### Resources

- **Supabase Docs:** https://supabase.com/docs
- **Supabase Discord:** https://discord.supabase.com
- **Supabase GitHub:** https://github.com/supabase/supabase
- **Stack Overflow:** Tag with `supabase`

---

## 🔄 Reset & Start Over

If all else fails, you can reset and start fresh:

### Reset Database

```sql
-- Drop all tables
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Re-run SQL scripts from SUPABASE_SETUP_GUIDE.md
```

### Reset Storage

1. Go to **Storage** → `product-images`
2. Select all files
3. Click "Delete"
4. Re-run migration script

### Reset Auth

1. Go to **Authentication** → **Users**
2. Delete test users
3. Create fresh test user

### Reset Local Environment

```bash
# Remove node_modules
rm -rf node_modules

# Remove .env.local
rm .env.local

# Reinstall
npm install

# Create fresh .env.local
cp .env.example .env.local
# Edit with your credentials

# Restart dev server
npm run dev
```

---

**Still stuck? Check the other documentation files or reach out for help!**
