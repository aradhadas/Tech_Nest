# 🗄️ TechNest Database Setup Guide

## Required Supabase Tables

### 1. `users` Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Index for faster queries
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_approval_status ON users(approval_status);
```

### 2. `products` Table

```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  specs JSONB DEFAULT '{}',
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  image TEXT,
  vendor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_vendor_id ON products(vendor_id);
```

**⚠️ CRITICAL:** The `vendor_id` column is essential for multi-vendor functionality. Without it:
- Multi-vendor cart splitting won't work correctly
- Vendors will see all products instead of just their own
- Orders won't be properly associated with vendors

### 3. `orders` Table

```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  delivery_address TEXT,
  delivery_phone TEXT,
  vendor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

### 4. `categories` Table (Optional)

```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Row Level Security (RLS) Policies

### Users Table

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Allow admins to read all users
CREATE POLICY "Admins can read all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow users to update their own data
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Allow admins to update all users
CREATE POLICY "Admins can update all users"
  ON users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow anyone to insert (for registration)
CREATE POLICY "Anyone can register"
  ON users FOR INSERT
  WITH CHECK (true);
```

### Products Table

```sql
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read active products
CREATE POLICY "Anyone can read active products"
  ON products FOR SELECT
  USING (status = 'active');

-- Allow vendors to read their own products
CREATE POLICY "Vendors can read own products"
  ON products FOR SELECT
  USING (vendor_id = auth.uid());

-- Allow vendors to insert their own products
CREATE POLICY "Vendors can insert own products"
  ON products FOR INSERT
  WITH CHECK (vendor_id = auth.uid());

-- Allow vendors to update their own products
CREATE POLICY "Vendors can update own products"
  ON products FOR UPDATE
  USING (vendor_id = auth.uid());

-- Allow admins to do everything
CREATE POLICY "Admins can manage all products"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Orders Table

```sql
-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow customers to read their own orders
CREATE POLICY "Customers can read own orders"
  ON orders FOR SELECT
  USING (customer_id = auth.uid());

-- Allow vendors to read their orders
CREATE POLICY "Vendors can read own orders"
  ON orders FOR SELECT
  USING (vendor_id = auth.uid());

-- Allow vendors to update their orders
CREATE POLICY "Vendors can update own orders"
  ON orders FOR UPDATE
  USING (vendor_id = auth.uid());

-- Allow anyone to insert orders (for guest checkout)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Allow admins to read all orders
CREATE POLICY "Admins can read all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to update all orders
CREATE POLICY "Admins can update all orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## Initial Data Setup

### 1. Create Admin User

```sql
-- First, register an admin user through the app
-- Then update their role in the database:

UPDATE users
SET role = 'admin', approval_status = 'approved'
WHERE email = 'admin@technest.com';
```

### 2. Create Vendor Users

```sql
-- Register vendors through the app
-- They will have approval_status = 'pending' by default
-- Admin can approve them through the admin panel
```

### 3. Add Products with Vendor IDs

**⚠️ IMPORTANT:** When adding products to the database, you MUST include the `vendor_id`:

```sql
-- Example: Add products for a specific vendor
INSERT INTO products (id, name, price, stock, category, brand, specs, description, status, vendor_id)
VALUES 
  ('prod-001', 'LED Strip Kit', 1200, 50, 'cat-001', 'TechBrand', '{"length": "5m", "color": "RGB"}', 'Programmable LED strip', 'active', 'vendor-uuid-here'),
  ('prod-002', 'Power Supply 12V', 800, 30, 'cat-002', 'PowerTech', '{"voltage": "12V", "amperage": "5A"}', 'Reliable power supply', 'active', 'vendor-uuid-here');
```

**To get vendor UUIDs:**

```sql
SELECT id, name, email, store_name 
FROM users 
WHERE role = 'vendor' AND approval_status = 'approved';
```

### 4. Update Existing Products

If you have existing products without `vendor_id`, assign them to vendors:

```sql
-- Assign all products to a specific vendor
UPDATE products
SET vendor_id = 'vendor-uuid-here'
WHERE vendor_id IS NULL;

-- Or distribute products among vendors
UPDATE products
SET vendor_id = (
  SELECT id FROM users 
  WHERE role = 'vendor' 
  ORDER BY RANDOM() 
  LIMIT 1
)
WHERE vendor_id IS NULL;
```

---

## Verification Queries

### Check Users

```sql
-- Count users by role
SELECT role, COUNT(*) 
FROM users 
GROUP BY role;

-- Check vendor approval status
SELECT name, email, store_name, approval_status 
FROM users 
WHERE role = 'vendor';
```

### Check Products

```sql
-- Count products by vendor
SELECT u.name, u.store_name, COUNT(p.id) as product_count
FROM users u
LEFT JOIN products p ON p.vendor_id = u.id
WHERE u.role = 'vendor'
GROUP BY u.id, u.name, u.store_name;

-- Check products without vendor
SELECT id, name, brand 
FROM products 
WHERE vendor_id IS NULL;
```

### Check Orders

```sql
-- Count orders by vendor
SELECT u.name, u.store_name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON o.vendor_id = u.id
WHERE u.role = 'vendor'
GROUP BY u.id, u.name, u.store_name;

-- Check orders without vendor
SELECT id, customer_name, total 
FROM orders 
WHERE vendor_id IS NULL;
```

---

## Common Issues & Solutions

### Issue 1: Products Not Showing for Vendor

**Problem:** Vendor dashboard shows 0 products

**Solution:**
```sql
-- Check if products have vendor_id
SELECT id, name, vendor_id FROM products LIMIT 10;

-- If vendor_id is NULL, assign products to vendor
UPDATE products
SET vendor_id = 'your-vendor-uuid'
WHERE vendor_id IS NULL;
```

### Issue 2: Orders Not Showing for Vendor

**Problem:** Vendor sees no orders even though customers placed orders

**Solution:**
```sql
-- Check if orders have vendor_id
SELECT id, customer_name, vendor_id FROM orders LIMIT 10;

-- This happens if products didn't have vendor_id when order was placed
-- You'll need to manually assign orders to vendors based on the products
```

### Issue 3: Multi-Vendor Cart Not Splitting

**Problem:** Cart with products from multiple vendors creates single order

**Solution:**
- Ensure all products in database have `vendor_id` populated
- Check browser console for errors during checkout
- Verify products in cart have `vendorId` property

```sql
-- Verify products have vendor_id
SELECT id, name, vendor_id 
FROM products 
WHERE id IN ('prod-001', 'prod-002');
```

### Issue 4: Vendor Approval Not Working

**Problem:** Vendor approval doesn't persist

**Solution:**
```sql
-- Check if approval_status column exists
SELECT approval_status FROM users WHERE role = 'vendor' LIMIT 1;

-- If column doesn't exist, add it
ALTER TABLE users 
ADD COLUMN approval_status TEXT DEFAULT 'pending' 
CHECK (approval_status IN ('pending', 'approved', 'rejected'));
```

---

## Testing Checklist

- [ ] Admin user exists and can login
- [ ] At least 2 vendor users exist with `approval_status = 'approved'`
- [ ] All products have `vendor_id` assigned
- [ ] Products are distributed among different vendors
- [ ] RLS policies are enabled and working
- [ ] Can create orders with products from single vendor
- [ ] Can create orders with products from multiple vendors
- [ ] Vendors see only their own products
- [ ] Vendors see only their own orders
- [ ] Customers see only their own orders
- [ ] Admin sees all users, products, and orders

---

## Quick Setup Script

```sql
-- 1. Create tables (run the CREATE TABLE statements above)

-- 2. Enable RLS (run the RLS policy statements above)

-- 3. Create test admin
-- (Register through app first, then run:)
UPDATE users SET role = 'admin', approval_status = 'approved' 
WHERE email = 'admin@test.com';

-- 4. Create test vendors
-- (Register through app first, then run:)
UPDATE users SET approval_status = 'approved' 
WHERE role = 'vendor';

-- 5. Get vendor IDs
SELECT id, name, email FROM users WHERE role = 'vendor';

-- 6. Assign products to vendors
-- Replace 'vendor-uuid-1' and 'vendor-uuid-2' with actual UUIDs
UPDATE products SET vendor_id = 'vendor-uuid-1' WHERE id LIKE 'prod-00%';
UPDATE products SET vendor_id = 'vendor-uuid-2' WHERE id LIKE 'prod-01%';

-- 7. Verify setup
SELECT 
  'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders;
```

---

## 🎯 Critical Requirements

For the application to work correctly:

1. ✅ All tables must exist with correct schema
2. ✅ RLS policies must be enabled
3. ✅ At least one admin user must exist
4. ✅ **All products MUST have `vendor_id` assigned**
5. ✅ Vendors must be approved (`approval_status = 'approved'`)
6. ✅ Products must have `status = 'active'` to be visible

**Without proper `vendor_id` assignment, multi-vendor functionality will not work!**
