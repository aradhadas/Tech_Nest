# TechNest: Comprehensive Academic Project Report
**Platform:** Role-Based E-Commerce Application for Electronic Devices
**Tech Stack:** React, Vite, Tailwind CSS, Supabase

---

## Executive Summary
TechNest is a robust, role-based web-based e-commerce platform dedicated to electronic devices. The system is designed to support three distinct user roles: **Customers** (buyers), **Vendors** (sellers), and **Admins** (system managers). Leveraging the modern Vite + React ecosystem for the frontend and Supabase (PostgreSQL) for backend services, TechNest integrates seamless authentication, Role-Level Security (RLS), and dynamic state management to orchestrate a complete shopping and catalog management experience.

---

## 1. Technology Stack details
The application is built on a modern, decoupled architecture heavily relying on serverless database models and reactive frontends.

### 1.1 Full Dependency Breakdown
| Package | Exact Version | Purpose / Domain |
|---|---|---|
| `react` & `react-dom` | ^19.2.0 | Core UI rendering engine |
| `react-router-dom` | ^7.15.0 | Client-side routing and protected routes |
| `@supabase/supabase-js` | ^2.105.3 | Backend-as-a-Service client (DB, Auth, Storage) |
| `react-hook-form` | ^7.70.0 | Form state and input handling |
| `@hookform/resolvers` & `zod` | ^5.2.2 / ^4.3.5 | Strict schema validation for user payloads |
| `tailwindcss` | ^3.4.19 | Utility-first CSS styling framework |
| `@radix-ui/react-*` | Various ^1.1.x | Headless accessible component primitives |
| `lucide-react` | ^0.562.0 | Standardized SVG iconography |
| `recharts` | ^2.15.4 | Data visualization for Admin/Vendor dashboards |
| `sonner` | ^2.0.7 | Global toast notification management |
| `vite` | ^7.2.4 | Hot-module-reloading and production build tool |
| `typescript` | ~5.9.3 | Static type checking and compilation |

---

## 2. Project Architecture & Directory Structure
The workspace follows a strict modular pattern, separating UI primitives, business logic hooks, layouts, and page views.

```text
TechNest/
├── docs/                        # Documentation and architecture guides
│   └── supabase-integration/    # Integration step-by-step guides
├── src/
│   ├── App.tsx                  # Main router wrapper and application shell
│   ├── components/              
│   │   ├── ui/                  # Reusable Radix UI & Shadcn primitives
│   │   ├── ProtectedRoute.tsx   # Auth/Role gatekeeper rendering logic
│   │   └── ToastContainer.tsx   # Sonner popup root
│   ├── contexts/                # Global React Providers
│   │   ├── AuthContext.tsx      # User session and role states
│   │   └── CartContext.tsx      # Local shopping cart states
│   ├── hooks/                   # Modular DB & logic abstractions
│   │   ├── useProducts.ts       # Products entity logic via Supabase
│   │   └── useOrders.ts         # Orders entity logic via Supabase
│   ├── lib/                     
│   │   └── supabase.ts          # Core Supabase singleton instance setup
│   ├── pages/                   # Route targets
│   │   ├── admin/               # Admin specific portal pages
│   │   ├── customer/            # Standard user portal pages
│   │   └── vendor/              # Vendor specific portal pages
│   └── types/
│       └── index.ts             # Source of truth for TypeScript Interfaces
└── [Config files (vite, tailwind, tsconfig, etc.)]
```

---

## 3. Database Schema & Setup (Supabase / PostgreSQL)

[INSERT SCREENSHOT HERE: Supabase Dashboard showing Tables and Relationships]

### 3.1 Users Table (`users`)
Managed jointly through `auth.users` trigger mappings and application logic.
- `id` (uuid): Primary constraint, mapped strictly to Supabase Auth UID.
- `email` (varchar): Unique identifier.
- `role` (enum): `customer`, `vendor`, `admin`. Sets authorization bounds.
- `approval_status` (enum): `pending`, `approved`, `rejected` (Specifically bounds Vendors).

### 3.2 Products Table (`products`)
- `id` (uuid): Primary constraint.
- `name`, `price`, `stock` (varchar/numeric/integer): Standard inventory metrics.
- `status` (enum): `active` or `inactive`. Soft-delete system.
- `vendor_id` (uuid): Foreign key linked to `users(id)`. Determines ownership.

### 3.3 Orders Table (`orders`)
- `id` (uuid): Primary constraint.
- `customer_id` (uuid): FK `users(id)`. Nullable for guest checkouts.
- `items` (jsonb): Schema-less array storing locked-in metadata of `CartItem` arrays.
- `total` (numeric): Computed transaction cost.
- `status` (enum): Delivery state machine (`pending` -> `processing` -> `shipped` -> `delivered`).

[INSERT SCREENSHOT HERE: SQL Execution or Supabase RLS Policies screen]

---

## 4. Authentication, Authorization & Roles

**Authentication Flow:**
1. User provides credentials to `<Login />` or `<Register />`.
2. Supabase verifies against `auth.users`, issuing a secure JWT to the client.
3. The `AuthContext.tsx` captures the session event using `supabase.auth.onAuthStateChange`.
4. It calls `fetchUserProfile` strictly matching the UID to `public.users`.
5. The `role` enum is unpacked to memory.

**Role Enforcement Flow (`ProtectedRoute.tsx`):**
Any sensitive route is wrapped in this component. 
- It matches the `allowedRoles={['vendor']}` property against `user.role`.
- It executes a secondary check: If a vendor's `approvalStatus === 'pending'`, it renders a hardcoded blocker pane restricting traversal.
- It returns early redirect mechanisms (`Navigate to='/customer/home'`) for unsanctioned URL modifications.

---

## 5. Detailed Module Breakdown

### 5.1 Customer Module
- **Purpose:** Public traversal of products, cart mutations, and checkout processing.
- **Pages:** `/customer/home`, `/customer/cart`, `/customer/checkout`, `/customer/orders`.
- **Database Hooks:** Reads exclusively from `active` products. Inserts localized tracking tokens into `orders`.
- **UI:** Product card grids, interactive side-panels for cart overviews.
[INSERT SCREENSHOT HERE: Customer Homepage / Catalog]
[INSERT SCREENSHOT HERE: Customer Checkout screen]

### 5.2 Vendor Module
- **Purpose:** Allow approved businesses to host inventory and manage assigned order fulfillments.
- **Pages:** `/vendor/dashboard`, `/vendor/products`, `/vendor/orders`.
- **Database Hooks:** Row Level Security (RLS) ensures vendors only execute `SELECT`, `UPDATE` & `INSERT` upon rows where `vendor_id = auth.uid()`.
- **UI:** Tabular data dashboards for metrics, Modals for Product additions.
[INSERT SCREENSHOT HERE: Vendor Dashboard with charts]
[INSERT SCREENSHOT HERE: Vendor Product Edit Modal]

### 5.3 Admin Module
- **Purpose:** Super-user oversight, moderation, and vendor verification.
- **Pages:** `/admin/dashboard`, `/admin/users`, `/admin/vendors`, `/admin/orders`.
- **Database Hooks:** Full permissive access queries via `EXISTS(user.role = 'admin')` RLS policies. Modifies `users.approval_status`.
- **UI:** User-Ban interfaces, Vendor approval datatables.
[INSERT SCREENSHOT HERE: Admin Vendor Approval Interface]

---

## 6. Comprehensive Data Flow Procedures

**A. Vendor Approval Flow**
1. Vendor registers. Account populates to `users` with `approval_status='pending'`.
2. Vendor attempts login. Intercepted by `ProtectedRoute.tsx`. Displayed: "Pending Approval".
3. Admin navigates to `/admin/vendors`. Fetch queries table.
4. Admin clicks "Approve". `<AdminVendors />` invokes `supabase.from('users').update({approval_status: 'approved'}).eq('id', targeted_id)`.
5. Status changes. Next vendor login succeeds without `ProtectedRoute.tsx` interruption.

**B. Checkout Processing Flow**
1. User clicks "Add to Cart". `<ProductDetailPanel />` invokes `CartContext.addToCart(Product)`.
2. Cart array state expands in RAM.
3. User visits `<Checkout />`. Form elements capture delivery info via React-Hook-Form.
4. Submission invokes `supabase.from('orders').insert({ items: CartState, customer_id: session.id ... })`.
5. DB confirms row addition. Context clears Cart array. System pushes to `/customer/confirmation`.

---

## 7. Security Implementation & RLS Design
Security relies on **Row Level Security (RLS)** in PostgreSQL rather than Node middleware.
- **Data Encapsulation:** Clients directly query the database via REST but are strictly gated by SQL `WITH CHECK` clauses. 
- **Vendor Restriction:** Policy `"products_insert_vendor"` dictates:
  `WITH CHECK (vendor_id = auth.uid() AND EXISTS(SELECT 1 FROM users WHERE id=auth.uid() AND approval_status='approved'))`. 
  This means even using external POST programs, vendors cannot counterfeit inventory.
- **Environment Isolation:** Vite utilizes `.env.local` via `import.meta.env` ensuring `VITE_SUPABASE_ANON_KEY` acts as a routing signature rather than a hyper-secure secret. The true security is the session JWT bounds.

---

## 8. Known Limitations & Recommendations
1. **Cart Persistence:** Currently, the cart is handled fully in-memory/context. Hard refreshes or cross-device logins will erase the cart array unless migrated to persistent `localStorage` arrays or a dedicated Supabase `carts` table schema in future phases.
2. **Product Image Handling:** Documentation suggests images rely inherently on mock `public/assets`. Production environments demand leveraging `supabase.storage` buckets (which are initialized in code but largely uncoupled).
3. **Guest Integrity:** Permitting `NULL` customer_ids within `orders` prevents subsequent analytics or receipt lookups if cookies are erased.

---

## 9. QA & Validation: Required Test Cases Matrix

*Note to Reviewer/Tester: Record actual results and add Screenshots to support the statuses below.*

| Test ID | Module | Scenario description | Steps to execute | Expected Result | Actual | Screenshot Link |
|---|---|---|---|---|---|---|
| AUTH-1 | Login | Standard authentication pass | Enter correct details for Customer | Grants access, routes to home | | [INSERT SS] |
| AUTH-2 | Login | Incorrect credentials rejection | Enter wrong password | Toast notification error | | [INSERT SS] |
| AUTH-3 | Route | Unauthorized URL bypass test | As Customer, type `/admin/dashboard` in URL bar | Redirection back to `/home` due to ProtectedRoute mismatch | | [INSERT SS] |
| VEND-1 | Vendor | Unapproved Status Block | Register new Vendor, login immediately | Reaches fallback screen "Application pending" | | [INSERT SS] |
| VEND-2 | Vendor | Creating New Inv. Item | As approved Vendor, form fill new product | Row adds to DB, shows in `vendor/products` | | [INSERT SS] |
| ADMN-1 | Admin | Approve pending vendor | In Admin portal, click 'Approve' toggle | Vendor is 'approved' | | [INSERT SS] |
| CUST-1 | Cart | State addition logic | Click "Add to Cart" on multiple distinct items | Context count increments correctly | | [INSERT SS] |
| CUST-2 | Cart | Empty Cart checkout block | Navigate to `/checkout` without items | Checkout form disabled/blocks | | [INSERT SS] |
| DB-RLS | Sec | Foreign product tampering | Vendor attempts to edit product owned by Vendor B | RLS halts query, generic UI error | | [INSERT SS] |

---
**End Of Report**