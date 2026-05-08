# TechNest Labs - Architecture Overview

## 🏗️ Current Architecture (Before Supabase)

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Pages      │  │  Components  │  │   Contexts   │ │
│  │              │  │              │  │              │ │
│  │ • Home       │  │ • ProductCard│  │ • AuthContext│ │
│  │ • Login      │  │ • Navbar     │  │ • CartContext│ │
│  │ • Cart       │  │ • Sidebar    │  │ • Toast      │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         src/data/index.ts (Mock Data)            │  │
│  │  • products[] - 40 hardcoded products            │  │
│  │  • categories[] - 4 hardcoded categories         │  │
│  │  • demoUsers[] - 5 hardcoded users               │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         public/products/ (Local Images)          │  │
│  │  • led-1.jpg, led-2.jpg, power-1.jpg...          │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

❌ Problems:
- No real authentication
- Data lost on refresh
- Can't add/edit products
- No multi-user support
- Images served from local files
```

---

## 🚀 New Architecture (After Supabase)

```
┌─────────────────────────────────────────────────────────────────┐
│                       React Frontend                             │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │   Pages      │  │  Components  │  │   Contexts & Hooks   │ │
│  │              │  │              │  │                      │ │
│  │ • Home       │  │ • ProductCard│  │ • AuthContext ✨     │ │
│  │ • Login      │  │ • Navbar     │  │ • useProducts() ✨   │ │
│  │ • Cart       │  │ • Sidebar    │  │ • useCategories() ✨ │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              src/lib/supabase.ts ✨                       │  │
│  │  Supabase Client - Handles all API communication         │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS API Calls
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Supabase Backend                            │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                  Authentication                         │    │
│  │  • User signup/login                                    │    │
│  │  • Session management                                   │    │
│  │  • Password reset                                       │    │
│  │  • JWT tokens                                           │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              PostgreSQL Database                        │    │
│  │                                                         │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │    │
│  │  │    users     │  │  categories  │  │  products   │ │    │
│  │  ├──────────────┤  ├──────────────┤  ├─────────────┤ │    │
│  │  │ id           │  │ id           │  │ id          │ │    │
│  │  │ name         │  │ name         │  │ name        │ │    │
│  │  │ email        │  │ icon         │  │ price       │ │    │
│  │  │ role         │  │ color        │  │ stock       │ │    │
│  │  │ phone        │  │ description  │  │ category    │ │    │
│  │  └──────────────┘  └──────────────┘  │ specs       │ │    │
│  │                                       │ image_url   │ │    │
│  │  ┌──────────────┐                    │ vendor_id   │ │    │
│  │  │   orders     │                    └─────────────┘ │    │
│  │  ├──────────────┤                                     │    │
│  │  │ id           │                                     │    │
│  │  │ customer_id  │                                     │    │
│  │  │ items        │                                     │    │
│  │  │ total        │                                     │    │
│  │  │ status       │                                     │    │
│  │  └──────────────┘                                     │    │
│  │                                                         │    │
│  │  🔒 Row Level Security (RLS) Policies:                │    │
│  │  • Customers see only their orders                    │    │
│  │  • Vendors manage only their products                 │    │
│  │  • Admins have full access                            │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                  Storage (CDN)                          │    │
│  │                                                         │    │
│  │  📦 product-images/ (Public Bucket)                    │    │
│  │     • led-1.jpg                                        │    │
│  │     • led-2.jpg                                        │    │
│  │     • power-1.jpg                                      │    │
│  │     • audio-1.jpg                                      │    │
│  │     • sec-1.jpg                                        │    │
│  │     • ... (14 images total)                            │    │
│  │                                                         │    │
│  │  🌐 Public URLs:                                       │    │
│  │  https://xxxxx.supabase.co/storage/v1/object/         │    │
│  │  public/product-images/led-1.jpg                       │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

✅ Benefits:
- Real user authentication with sessions
- Persistent data storage
- Multi-user support with roles
- Secure file storage with CDN
- Scalable PostgreSQL database
- Row-level security
```

---

## 🔄 Data Flow Examples

### Example 1: User Login

```
┌─────────┐                                    ┌──────────┐
│ User    │                                    │ Supabase │
└────┬────┘                                    └────┬─────┘
     │                                              │
     │ 1. Enter email & password                   │
     │────────────────────────────────────────────>│
     │                                              │
     │                    2. Verify credentials    │
     │                       Check auth.users      │
     │                                              │
     │ 3. Return JWT token + session               │
     │<────────────────────────────────────────────│
     │                                              │
     │ 4. Fetch user profile from public.users     │
     │────────────────────────────────────────────>│
     │                                              │
     │ 5. Return user data (name, role, etc.)      │
     │<────────────────────────────────────────────│
     │                                              │
     │ 6. Store in AuthContext                     │
     │ 7. Redirect to dashboard                    │
     │                                              │
```

### Example 2: Loading Products

```
┌──────────┐                                   ┌──────────┐
│ HomePage │                                   │ Supabase │
└────┬─────┘                                   └────┬─────┘
     │                                              │
     │ 1. useProducts() hook called                │
     │                                              │
     │ 2. SELECT * FROM products                   │
     │    WHERE status = 'active'                  │
     │────────────────────────────────────────────>│
     │                                              │
     │                    3. Apply RLS policies    │
     │                       (anyone can read)     │
     │                                              │
     │ 4. Return 40 products with image URLs       │
     │<────────────────────────────────────────────│
     │                                              │
     │ 5. Update state: setProducts(data)          │
     │ 6. Render ProductCard components            │
     │                                              │
     │ 7. Browser loads images from Storage CDN    │
     │────────────────────────────────────────────>│
     │                                              │
     │ 8. Images delivered                         │
     │<────────────────────────────────────────────│
     │                                              │
```

### Example 3: Creating an Order

```
┌──────────┐                                   ┌──────────┐
│ Customer │                                   │ Supabase │
└────┬─────┘                                   └────┬─────┘
     │                                              │
     │ 1. Click "Place Order"                      │
     │                                              │
     │ 2. INSERT INTO orders                       │
     │    (customer_id, items, total, ...)         │
     │────────────────────────────────────────────>│
     │                                              │
     │                    3. Check RLS policy:     │
     │                       auth.uid() =          │
     │                       customer_id ✅        │
     │                                              │
     │                    4. Insert order          │
     │                    5. Update product stock  │
     │                                              │
     │ 6. Return order ID (TN-00001)               │
     │<────────────────────────────────────────────│
     │                                              │
     │ 7. Show confirmation page                   │
     │                                              │
```

---

## 🔐 Security Model

### Row Level Security (RLS) Policies

```sql
-- Example: Products Table

┌─────────────────────────────────────────────────────────┐
│                    products table                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  👥 Anyone (not logged in):                             │
│     ✅ SELECT where status = 'active'                   │
│     ❌ INSERT, UPDATE, DELETE                           │
│                                                          │
│  🛍️ Customer (logged in):                              │
│     ✅ SELECT where status = 'active'                   │
│     ❌ INSERT, UPDATE, DELETE                           │
│                                                          │
│  🏪 Vendor (logged in):                                 │
│     ✅ SELECT where status = 'active'                   │
│     ✅ INSERT where vendor_id = auth.uid()              │
│     ✅ UPDATE where vendor_id = auth.uid()              │
│     ✅ DELETE where vendor_id = auth.uid()              │
│                                                          │
│  👑 Admin (logged in):                                  │
│     ✅ SELECT all                                       │
│     ✅ INSERT any                                       │
│     ✅ UPDATE any                                       │
│     ✅ DELETE any                                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 File Structure

```
technest-labs/
│
├── public/
│   └── products/              # ⚠️ Will be migrated to Supabase Storage
│       ├── led-1.jpg
│       ├── power-1.jpg
│       └── ...
│
├── src/
│   ├── components/
│   │   ├── ProductCard.tsx
│   │   ├── Navbar.tsx
│   │   └── ...
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx           # ⚠️ Will be replaced
│   │   ├── AuthContext.supabase.tsx  # ✨ New Supabase auth
│   │   ├── CartContext.tsx
│   │   └── ToastContext.tsx
│   │
│   ├── hooks/                        # ✨ New
│   │   ├── useProducts.ts            # Fetch products from DB
│   │   └── useCategories.ts          # Fetch categories from DB
│   │
│   ├── lib/                          # ✨ New
│   │   └── supabase.ts               # Supabase client setup
│   │
│   ├── pages/
│   │   ├── customer/
│   │   │   ├── Home.tsx              # ⚠️ Will be updated
│   │   │   ├── Cart.tsx
│   │   │   └── ...
│   │   ├── admin/
│   │   └── vendor/
│   │
│   ├── data/
│   │   └── index.ts                  # ⚠️ Will be deprecated
│   │
│   └── types/
│       └── index.ts
│
├── scripts/                          # ✨ New
│   └── migrate-to-supabase.ts        # Migration script
│
├── .env.example                      # ✨ New
├── .env.local                        # ✨ New (you create this)
├── SUPABASE_SETUP_GUIDE.md          # ✨ New
├── IMPLEMENTATION_STEPS.md          # ✨ New
├── SUPABASE_QUICK_REFERENCE.md      # ✨ New
└── ARCHITECTURE.md                   # ✨ New (this file)
```

---

## 🎯 Migration Path

```
Step 1: Setup Supabase
┌─────────────────────────┐
│ Create Supabase Project │
│ Run SQL scripts         │
│ Create Storage bucket   │
└────────┬────────────────┘
         │
         ▼
Step 2: Install & Configure
┌─────────────────────────┐
│ npm install packages    │
│ Create .env.local       │
│ Add credentials         │
└────────┬────────────────┘
         │
         ▼
Step 3: Migrate Data
┌─────────────────────────┐
│ Run migration script    │
│ Upload images           │
│ Seed database           │
└────────┬────────────────┘
         │
         ▼
Step 4: Update Code
┌─────────────────────────┐
│ Replace AuthContext     │
│ Update Home page        │
│ Use new hooks           │
└────────┬────────────────┘
         │
         ▼
Step 5: Test & Deploy
┌─────────────────────────┐
│ Test authentication     │
│ Test product loading    │
│ Test cart & orders      │
└─────────────────────────┘
```

---

## 🚀 Performance Benefits

### Before (Local Files)
- ❌ Images served from same server as app
- ❌ No caching
- ❌ Slow on mobile networks
- ❌ Limited by server bandwidth

### After (Supabase Storage CDN)
- ✅ Images served from global CDN
- ✅ Automatic caching
- ✅ Fast on all networks
- ✅ Unlimited bandwidth (free tier: 1GB)

### Before (Mock Data)
- ❌ Data lost on refresh
- ❌ No persistence
- ❌ Single user only
- ❌ Can't add/edit data

### After (PostgreSQL Database)
- ✅ Data persists forever
- ✅ Multi-user support
- ✅ Real-time updates possible
- ✅ Full CRUD operations

---

## 📊 Scalability

```
Free Tier Limits:
├── Database: 500 MB
├── Storage: 1 GB
├── Bandwidth: 2 GB/month
├── API Requests: Unlimited
└── Users: Unlimited

Your Current Usage:
├── Database: ~5 MB (40 products + users)
├── Storage: ~10 MB (14 images)
├── Bandwidth: Depends on traffic
└── Users: Unlimited

Room to Grow:
├── Can add 1000s more products
├── Can add 100s more images
├── Can handle 1000s of users
└── Can upgrade to paid plan if needed
```

---

Ready to implement? Follow the steps in `IMPLEMENTATION_STEPS.md`!
