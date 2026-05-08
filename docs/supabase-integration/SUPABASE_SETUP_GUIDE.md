# Supabase Integration Guide for TechNest Labs

## 📋 Overview
This guide will help you integrate Supabase for:
1. **Authentication** - Replace mock auth with real user authentication
2. **Database** - Store products, categories, users, and orders
3. **Storage** - Store product images

---

## 🎯 Phase 1: Supabase Project Setup

### Step 1.1: Create Supabase Account & Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click "New Project"
4. Fill in:
   - **Project Name**: `technest-labs` (or your choice)
   - **Database Password**: (save this securely!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for development
5. Wait 2-3 minutes for project to be created

### Step 1.2: Get Your API Keys
1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values (you'll need them):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (long string)
   - **service_role key**: `eyJhbGc...` (keep this secret!)

---

## 🗄️ Phase 2: Database Schema Setup

### Step 2.1: Create Tables

Go to **SQL Editor** in Supabase dashboard and run these SQL commands:

#### 1. Users Table (extends Supabase auth.users)
```sql
-- Create users profile table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'vendor', 'admin')),
  address TEXT,
  joined_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  approval_status TEXT DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  store_name TEXT,
  store_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### 2. Categories Table
```sql
CREATE TABLE public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Everyone can read categories
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

-- Only admins can modify categories
CREATE POLICY "Admins can insert categories" ON public.categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### 3. Products Table
```sql
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL REFERENCES public.categories(id),
  brand TEXT NOT NULL,
  specs JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  image_url TEXT,
  vendor_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Everyone can view active products
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (status = 'active');

-- Vendors can manage their own products
CREATE POLICY "Vendors can insert their products" ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'vendor' AND id = vendor_id
    )
  );

CREATE POLICY "Vendors can update their products" ON public.products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'vendor' AND id = vendor_id
    )
  );

-- Admins can do everything
CREATE POLICY "Admins can manage all products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### 4. Orders Table
```sql
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.users(id),
  customer_name TEXT NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  delivery_address TEXT NOT NULL,
  delivery_phone TEXT NOT NULL,
  vendor_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Customers can view their own orders
CREATE POLICY "Customers can view their orders" ON public.orders
  FOR SELECT USING (auth.uid() = customer_id);

-- Customers can create orders
CREATE POLICY "Customers can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Vendors can view orders for their products
CREATE POLICY "Vendors can view their orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'vendor' AND id = vendor_id
    )
  );

-- Admins can view all orders
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### 5. Create Indexes for Performance
```sql
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_vendor ON public.products(vendor_id);
CREATE INDEX idx_orders_customer ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_users_role ON public.users(role);
```

#### 6. Create Updated_at Trigger
```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 📦 Phase 3: Storage Setup

### Step 3.1: Create Storage Bucket
1. In Supabase dashboard, go to **Storage**
2. Click "Create a new bucket"
3. Name it: `product-images`
4. Make it **Public** (so images can be accessed without auth)
5. Click "Create bucket"

### Step 3.2: Set Storage Policies
Go to **Storage** → **Policies** → `product-images` bucket:

```sql
-- Allow public read access
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Allow vendors and admins to delete their images
CREATE POLICY "Vendors can delete their images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

---

## 🔄 Phase 4: Data Migration

### Step 4.1: Seed Categories
Run this in SQL Editor:

```sql
INSERT INTO public.categories (id, name, icon, color, description) VALUES
  ('cat-001', 'LED & Light Projects', '💡', '#F59E0B', 'LED circuits, light sensors, and lighting projects'),
  ('cat-002', 'Power Supply & Charging', '🔋', '#16A34A', 'Power banks, chargers, voltage regulators'),
  ('cat-003', 'Sound & Audio Projects', '🔊', '#2563EB', 'Amplifiers, speakers, sound circuits'),
  ('cat-004', 'Security & Sensor Projects', '🔐', '#E8321C', 'Motion sensors, alarms, RFID systems');
```

### Step 4.2: Upload Product Images
You'll need to upload the 14 images from `public/products/` to Supabase Storage.

**Option A: Manual Upload (Quick)**
1. Go to Storage → product-images bucket
2. Click "Upload files"
3. Select all images from `public/products/` folder
4. Upload them

**Option B: Programmatic Upload (Automated)**
I'll create a migration script for you in the next phase.

### Step 4.3: Seed Products
After images are uploaded, run the product seeding script (I'll create this for you).

---

## 💻 Phase 5: Frontend Integration

### Step 5.1: Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### Step 5.2: Environment Variables
Create `.env.local` file in project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Add to `.gitignore`:
```
.env.local
```

### Step 5.3: Code Changes
I'll create/update these files:
1. `src/lib/supabase.ts` - Supabase client setup
2. `src/contexts/AuthContext.tsx` - Real authentication
3. `src/hooks/useProducts.ts` - Fetch products from DB
4. `src/hooks/useCategories.ts` - Fetch categories from DB
5. Migration scripts for data seeding

---

## ✅ Testing Checklist

After setup, test:
- [ ] User registration works
- [ ] User login works
- [ ] Products load from database
- [ ] Product images display correctly
- [ ] Categories filter works
- [ ] Cart functionality works
- [ ] Orders can be created
- [ ] Admin can manage products
- [ ] Vendor can manage their products

---

## 🚀 Next Steps

1. Complete Phase 1 & 2 (Supabase setup + Database)
2. Complete Phase 3 (Storage setup)
3. Tell me when ready, and I'll implement Phase 4 & 5 (Code changes)

---

## 📝 Notes

- **Free Tier Limits**: 500MB database, 1GB storage, 50MB file uploads
- **Security**: Never commit `.env.local` to git
- **RLS**: Row Level Security is enabled for data protection
- **Backup**: Supabase auto-backups on paid plans

---

Ready to start? Let me know when you've completed Phases 1-3, and I'll implement all the code changes!
