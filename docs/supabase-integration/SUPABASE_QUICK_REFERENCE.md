# Supabase Quick Reference Card

## 📦 What Was Created

### Configuration Files
- ✅ `.env.example` - Template for environment variables
- ✅ `SUPABASE_SETUP_GUIDE.md` - Complete setup instructions
- ✅ `IMPLEMENTATION_STEPS.md` - Step-by-step integration guide

### Code Files
- ✅ `src/lib/supabase.ts` - Supabase client configuration
- ✅ `src/contexts/AuthContext.supabase.tsx` - Real authentication (will replace mock)
- ✅ `src/hooks/useProducts.ts` - Fetch products from database
- ✅ `src/hooks/useCategories.ts` - Fetch categories from database
- ✅ `scripts/migrate-to-supabase.ts` - Automated data migration script

---

## 🚀 Quick Start (5 Steps)

### 1️⃣ Create Supabase Project (5 min)
- Go to https://supabase.com
- Create new project
- Save your URL and anon key

### 2️⃣ Setup Database (10 min)
- Open SQL Editor in Supabase
- Copy/paste SQL from `SUPABASE_SETUP_GUIDE.md` Phase 2
- Run all SQL commands

### 3️⃣ Setup Storage (2 min)
- Go to Storage in Supabase
- Create bucket: `product-images` (public)
- Set storage policies from guide

### 4️⃣ Configure App (2 min)
```bash
# Install dependencies
npm install @supabase/supabase-js
npm install -D tsx

# Create environment file
cp .env.example .env.local

# Edit .env.local with your credentials
```

### 5️⃣ Migrate Data (1 min)
```bash
# Upload images and seed database
npx tsx scripts/migrate-to-supabase.ts
```

---

## 📊 Database Schema Overview

```
┌─────────────────┐
│     users       │  ← Extends Supabase auth.users
├─────────────────┤
│ id (UUID)       │  Primary Key
│ name            │
│ email           │
│ role            │  customer | vendor | admin
│ approval_status │  pending | approved | rejected
│ store_name      │  (for vendors)
└─────────────────┘

┌─────────────────┐
│   categories    │
├─────────────────┤
│ id (TEXT)       │  Primary Key (cat-001, cat-002...)
│ name            │
│ icon            │
│ color           │
└─────────────────┘

┌─────────────────┐
│    products     │
├─────────────────┤
│ id (TEXT)       │  Primary Key (p01, p02...)
│ name            │
│ price           │
│ stock           │
│ category        │  → categories.id
│ brand           │
│ specs (JSONB)   │  { IC: "NE555", Power: "9V" }
│ image_url       │  Supabase Storage URL
│ vendor_id       │  → users.id
│ status          │  active | inactive
└─────────────────┘

┌─────────────────┐
│     orders      │
├─────────────────┤
│ id (TEXT)       │  Primary Key (TN-00001...)
│ customer_id     │  → users.id
│ items (JSONB)   │  [{ product, quantity }]
│ total           │
│ status          │  pending | processing | shipped...
│ delivery_address│
└─────────────────┘
```

---

## 🔐 Authentication Flow

### Registration
```typescript
const { success, error } = await register(
  name, 
  email, 
  phone, 
  password, 
  'customer'
);
```

### Login
```typescript
const { success, error } = await login(email, password);
```

### Get Current User
```typescript
const { user } = useAuth();
// user.role → 'customer' | 'vendor' | 'admin'
```

---

## 🖼️ Storage Structure

```
product-images/  (public bucket)
├── led-1.jpg
├── led-2.jpg
├── led-3.jpg
├── led-4.jpg
├── power-1.jpg
├── power-2.jpg
├── power-3.jpg
├── power-4.jpg
├── audio-1.jpg
├── audio-2.jpg
├── sec-1.jpg
├── sec-2.jpg
├── sec-3.jpg
└── sec-4.jpg
```

**Get Image URL:**
```typescript
const url = supabase.storage
  .from('product-images')
  .getPublicUrl('led-1.jpg').data.publicUrl;
```

---

## 🎯 Data Migration Summary

The migration script will:
1. ✅ Upload 14 product images to Storage
2. ✅ Seed 4 categories to Database
3. ✅ Seed 40 products to Database
4. ✅ Link products to their images

**Before Migration:**
- Products: Hardcoded in `src/data/index.ts`
- Images: Local files in `public/products/`

**After Migration:**
- Products: Supabase Database (PostgreSQL)
- Images: Supabase Storage (CDN)

---

## 🔄 Key Changes to Your App

### Before (Mock Data)
```typescript
import { products } from '@/data';
// products is a hardcoded array
```

### After (Real Database)
```typescript
import { useProducts } from '@/hooks/useProducts';

const { products, loading, error } = useProducts();
// products fetched from Supabase
```

### Before (Mock Auth)
```typescript
const login = (email, password, role) => {
  // Checks hardcoded demoUsers array
};
```

### After (Real Auth)
```typescript
const login = async (email, password) => {
  // Real authentication with Supabase
  // Returns { success, error }
};
```

---

## 🛠️ Useful Commands

```bash
# Install dependencies
npm install @supabase/supabase-js

# Run migration
npx tsx scripts/migrate-to-supabase.ts

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## 📝 Environment Variables

```env
# .env.local (DO NOT COMMIT!)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**Access in code:**
```typescript
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

---

## ✅ Testing Checklist

After setup, verify:

**Authentication:**
- [ ] Can register new customer
- [ ] Can register new vendor (pending approval)
- [ ] Can login with email/password
- [ ] Can logout
- [ ] User profile persists on refresh

**Products:**
- [ ] Products load from database
- [ ] Images display correctly
- [ ] Can filter by category
- [ ] Can search products
- [ ] Can sort products

**Cart & Orders:**
- [ ] Can add products to cart
- [ ] Can checkout
- [ ] Orders save to database
- [ ] Can view order history

**Admin:**
- [ ] Can view all users
- [ ] Can approve vendors
- [ ] Can manage products
- [ ] Can view all orders

---

## 🆘 Common Issues

### Issue: Images not loading
**Solution:** Check Storage bucket is public and images uploaded

### Issue: "Missing environment variables"
**Solution:** Create `.env.local` with your Supabase credentials

### Issue: "Row Level Security policy violation"
**Solution:** Check RLS policies in Supabase dashboard

### Issue: Products not loading
**Solution:** Run migration script to seed database

---

## 📚 Resources

- **Supabase Docs:** https://supabase.com/docs
- **Supabase Auth:** https://supabase.com/docs/guides/auth
- **Supabase Storage:** https://supabase.com/docs/guides/storage
- **Row Level Security:** https://supabase.com/docs/guides/auth/row-level-security

---

## 🎉 What You Get

✅ **Real Authentication** - No more mock users
✅ **Persistent Data** - Database instead of hardcoded arrays
✅ **Image CDN** - Fast image delivery via Supabase Storage
✅ **Security** - Row Level Security policies
✅ **Scalability** - PostgreSQL database
✅ **Free Tier** - 500MB DB + 1GB Storage

---

**Need Help?** Check `SUPABASE_SETUP_GUIDE.md` for detailed instructions!
