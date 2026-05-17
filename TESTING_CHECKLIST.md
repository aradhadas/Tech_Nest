# 🧪 TechNest — Complete Testing Checklist

## Pre-Testing Setup

- [ ] Supabase project is running
- [ ] `.env.local` has correct Supabase credentials
- [ ] Database tables exist: `users`, `products`, `orders`, `categories`
- [ ] At least 2 products exist in database with different `vendor_id` values
- [ ] Development server is running (`npm run dev`)

---

## Test Suite 1: Registration & Role Assignment

### Test 1.1: Customer Registration
- [ ] Navigate to `/register`
- [ ] Fill form: name, email, phone, password
- [ ] Select role: **Customer**
- [ ] Click "Create Account"
- [ ] **Expected:** Redirects to `/customer/home`
- [ ] **Expected:** User appears in Supabase `users` table with `role='customer'`

### Test 1.2: Vendor Registration
- [ ] Navigate to `/register`
- [ ] Fill form with different email
- [ ] Select role: **Vendor**
- [ ] Click "Create Account"
- [ ] **Expected:** Redirects to `/vendor/dashboard`
- [ ] **Expected:** User appears in Supabase `users` table with `role='vendor'`

### Test 1.3: Admin Registration
- [ ] Navigate to `/register`
- [ ] Fill form with different email
- [ ] Select role: **Admin**
- [ ] Click "Create Account"
- [ ] **Expected:** Redirects to `/admin/dashboard`
- [ ] **Expected:** User appears in Supabase `users` table with `role='admin'`

### Test 1.4: Registration Error Handling
- [ ] Try registering with existing email
- [ ] **Expected:** Error message displayed
- [ ] **Expected:** Does NOT redirect

---

## Test Suite 2: Login & Role-Based Redirect

### Test 2.1: Customer Login
- [ ] Navigate to `/login`
- [ ] Enter customer credentials
- [ ] Click "Sign In"
- [ ] **Expected:** Redirects to `/customer/home`
- [ ] **Expected:** Navbar shows customer name

### Test 2.2: Vendor Login
- [ ] Logout (if logged in)
- [ ] Navigate to `/login`
- [ ] Enter vendor credentials
- [ ] Click "Sign In"
- [ ] **Expected:** Redirects to `/vendor/dashboard` (NOT `/customer/home`)
- [ ] **Expected:** Sidebar shows "Vendor Dashboard"

### Test 2.3: Admin Login
- [ ] Logout
- [ ] Navigate to `/login`
- [ ] Enter admin credentials
- [ ] Click "Sign In"
- [ ] **Expected:** Redirects to `/admin/dashboard` (NOT `/customer/home`)
- [ ] **Expected:** Sidebar shows "Admin Dashboard"

### Test 2.4: Login Error Handling
- [ ] Try logging in with wrong password
- [ ] **Expected:** Error message displayed
- [ ] **Expected:** Does NOT redirect

---

## Test Suite 3: Customer Order Flow

### Test 3.1: Browse & Add to Cart
- [ ] Login as customer
- [ ] Navigate to `/customer/home`
- [ ] Click category filter (e.g., "LED Kits")
- [ ] **Expected:** Products filtered by category
- [ ] Click product card
- [ ] **Expected:** ProductDetailPanel opens
- [ ] Adjust quantity to 2
- [ ] Click "Add to Cart"
- [ ] **Expected:** Toast notification appears
- [ ] **Expected:** Cart icon shows "2"

### Test 3.2: Cart Management
- [ ] Click cart icon → Navigate to `/customer/cart`
- [ ] **Expected:** Shows 2 items
- [ ] Click "+" button
- [ ] **Expected:** Quantity increases to 3
- [ ] Click "-" button twice
- [ ] **Expected:** Quantity decreases to 1
- [ ] Click "X" (remove)
- [ ] **Expected:** Item removed from cart
- [ ] Add item back
- [ ] **Expected:** Item appears in cart again

### Test 3.3: Cart Persistence
- [ ] Add 2 different products to cart
- [ ] Refresh page (F5)
- [ ] **Expected:** Cart still has 2 items
- [ ] Close browser completely
- [ ] Reopen and navigate to site
- [ ] **Expected:** Cart still has 2 items

### Test 3.4: Checkout & Order Placement
- [ ] With items in cart, click "Proceed to Checkout"
- [ ] Fill delivery form:
  - Name: "Test Customer"
  - Phone: "+880 1234567890"
  - Address: "123 Test Street"
  - City: "Dhaka"
  - Postal Code: "1200"
- [ ] Click "Place Order"
- [ ] **Expected:** Redirects to `/customer/confirmation`
- [ ] **Expected:** Order appears in Supabase `orders` table
- [ ] Check order in database:
  - [ ] `customer_id` = logged-in user's ID ✅
  - [ ] `customer_name` = "Test Customer" ✅
  - [ ] `status` = 'pending' ✅
  - [ ] `vendor_id` = NOT NULL ✅ (should match product's vendor_id)
  - [ ] `delivery_address` includes city and postal code ✅
  - [ ] `items` array contains products ✅
- [ ] **Expected:** Cart is now empty

---

## Test Suite 4: Customer Order History

### Test 4.1: View Own Orders
- [ ] Login as Customer A
- [ ] Navigate to `/customer/orders`
- [ ] **Expected:** Shows only Customer A's orders
- [ ] Note the order IDs displayed
- [ ] Logout

### Test 4.2: Data Isolation
- [ ] Login as Customer B (different user)
- [ ] Navigate to `/customer/orders`
- [ ] **Expected:** Shows only Customer B's orders
- [ ] **Expected:** Does NOT show Customer A's orders
- [ ] Verify order IDs are different from Customer A

### Test 4.3: Order Details
- [ ] Click expand button (▼) on an order
- [ ] **Expected:** Shows:
  - Order items with quantities
  - Delivery address
  - Phone number
  - Order date
  - Total price

---

## Test Suite 5: Vendor Order Management

### Test 5.1: Vendor Dashboard Filtering
- [ ] Login as Vendor A
- [ ] Navigate to `/vendor/dashboard`
- [ ] **Expected:** Shows stats:
  - Total Products
  - Pending Orders
  - Completed Orders
- [ ] **Expected:** Recent Orders table shows only orders with `vendor_id = Vendor A's ID`
- [ ] Note the order IDs displayed
- [ ] Logout

### Test 5.2: Vendor Data Isolation
- [ ] Login as Vendor B (different vendor)
- [ ] Navigate to `/vendor/dashboard`
- [ ] **Expected:** Shows only orders with `vendor_id = Vendor B's ID`
- [ ] **Expected:** Does NOT show Vendor A's orders
- [ ] Verify order IDs are different from Vendor A

### Test 5.3: Status Update from Dashboard
- [ ] On Vendor Dashboard, find an order with status "Pending"
- [ ] Change status dropdown to "Processing"
- [ ] **Expected:** Toast notification appears
- [ ] **Expected:** Status chip updates to "Processing"
- [ ] Refresh page
- [ ] **Expected:** Status is still "Processing" (persisted)
- [ ] Check Supabase `orders` table
- [ ] **Expected:** `status` column = 'processing' ✅

### Test 5.4: Status Update from Orders Page
- [ ] Navigate to `/vendor/orders`
- [ ] Find the same order
- [ ] Change status to "Shipped"
- [ ] **Expected:** Toast notification appears
- [ ] **Expected:** Status updates
- [ ] Check Supabase
- [ ] **Expected:** `status` = 'shipped' ✅

### Test 5.5: Complete Order Lifecycle
- [ ] Update order status to "Delivered"
- [ ] **Expected:** Status updates successfully
- [ ] Navigate back to `/vendor/dashboard`
- [ ] **Expected:** "Completed" stat increases by 1
- [ ] **Expected:** "Pending Orders" stat decreases by 1

---

## Test Suite 6: Real-Time Synchronization

### Test 6.1: Customer Sees Vendor Updates
- [ ] Open two browser windows side-by-side
- [ ] Window 1: Login as Customer, go to `/customer/orders`
- [ ] Window 2: Login as Vendor, go to `/vendor/orders`
- [ ] In Window 2 (Vendor): Change order status to "Shipped"
- [ ] **Expected:** Window 1 (Customer) automatically updates status (no refresh needed)
- [ ] Verify status chip changes color

### Test 6.2: Admin Sees All Updates
- [ ] Open three browser windows
- [ ] Window 1: Customer at `/customer/orders`
- [ ] Window 2: Vendor at `/vendor/orders`
- [ ] Window 3: Admin at `/admin/orders`
- [ ] In Window 2 (Vendor): Update order status
- [ ] **Expected:** All three windows update automatically

---

## Test Suite 7: Admin Dashboard

### Test 7.1: View All Orders
- [ ] Login as Admin
- [ ] Navigate to `/admin/orders`
- [ ] **Expected:** Shows ALL orders from ALL customers and vendors
- [ ] Count total orders displayed
- [ ] Compare with Supabase `orders` table row count
- [ ] **Expected:** Counts match

### Test 7.2: Search & Filter
- [ ] In search box, type an order ID
- [ ] **Expected:** Filters to show only that order
- [ ] Clear search
- [ ] Change status filter to "Pending"
- [ ] **Expected:** Shows only pending orders
- [ ] Change to "Delivered"
- [ ] **Expected:** Shows only delivered orders

### Test 7.3: Order Detail Panel
- [ ] Click any order
- [ ] **Expected:** Side panel opens
- [ ] **Expected:** Shows:
  - Order ID
  - Status chip
  - Customer name
  - Delivery address
  - Phone
  - All items with quantities and prices
  - Total amount
- [ ] Click X to close
- [ ] **Expected:** Panel closes

---

## Test Suite 8: Edge Cases & Error Handling

### Test 8.1: Out of Stock
- [ ] Login as customer
- [ ] Find a product with stock = 1
- [ ] Add 1 to cart
- [ ] Try to add another
- [ ] **Expected:** Toast error: "All available units are already in your cart"
- [ ] **Expected:** Cart still has only 1 unit

### Test 8.2: Empty Cart Checkout
- [ ] Clear cart completely
- [ ] Navigate to `/customer/checkout`
- [ ] **Expected:** Shows "Your cart is empty" message
- [ ] **Expected:** "Continue Shopping" button visible

### Test 8.3: Incomplete Checkout Form
- [ ] Add items to cart
- [ ] Go to checkout
- [ ] Leave "Name" field empty
- [ ] Click "Place Order"
- [ ] **Expected:** Error toast: "Please fill in all required fields"
- [ ] **Expected:** Order NOT created

### Test 8.4: Unauthenticated Order
- [ ] Logout completely
- [ ] Add items to cart (as guest)
- [ ] Go to checkout
- [ ] Fill form and place order
- [ ] **Expected:** Order created with `customer_id = null`
- [ ] **Expected:** Order still has `customer_name` from form

---

## Test Suite 9: Multi-Device Testing

### Test 9.1: Mobile Responsive
- [ ] Open site on mobile device or resize browser to mobile width
- [ ] Test all flows:
  - [ ] Registration
  - [ ] Login
  - [ ] Browse products
  - [ ] Add to cart
  - [ ] Checkout
  - [ ] View orders
- [ ] **Expected:** All layouts adapt properly

### Test 9.2: Tablet Responsive
- [ ] Resize to tablet width (768px - 1024px)
- [ ] Test vendor dashboard
- [ ] Test admin orders page
- [ ] **Expected:** Layouts adapt properly

---

## Test Suite 10: Performance & Data Integrity

### Test 10.1: Large Order
- [ ] Add 10 different products to cart
- [ ] Place order
- [ ] **Expected:** All 10 items appear in order
- [ ] **Expected:** Total calculated correctly
- [ ] **Expected:** All product stocks decremented

### Test 10.2: Concurrent Orders
- [ ] Open two browser windows
- [ ] Login as two different customers
- [ ] Both add same product to cart
- [ ] Both place orders simultaneously
- [ ] **Expected:** Both orders created successfully
- [ ] **Expected:** Stock decremented correctly (no race condition)

### Test 10.3: Real-Time Load
- [ ] Open 5 browser tabs
- [ ] All tabs at `/customer/orders` or `/vendor/orders`
- [ ] Update order status in one tab
- [ ] **Expected:** All 5 tabs update within 1-2 seconds

---

## 🎯 Success Criteria

### Critical (Must Pass)
- [ ] All registration flows redirect correctly
- [ ] All login flows redirect based on role
- [ ] Vendors only see their own orders
- [ ] Customers only see their own orders
- [ ] Orders created with correct `vendor_id` and `customer_id`
- [ ] Status updates persist to database
- [ ] Cart persists across page refreshes
- [ ] Real-time sync works

### Important (Should Pass)
- [ ] Toast notifications appear for all actions
- [ ] Error handling works for invalid inputs
- [ ] Stock validation prevents over-ordering
- [ ] Mobile layouts work properly
- [ ] Admin sees all orders

### Nice to Have
- [ ] Fast real-time updates (<2 seconds)
- [ ] Smooth animations
- [ ] No console errors
- [ ] Proper loading states

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

Test Suite 1: Registration & Role Assignment
  1.1 Customer Registration: [ PASS / FAIL ]
  1.2 Vendor Registration: [ PASS / FAIL ]
  1.3 Admin Registration: [ PASS / FAIL ]
  1.4 Error Handling: [ PASS / FAIL ]

Test Suite 2: Login & Role-Based Redirect
  2.1 Customer Login: [ PASS / FAIL ]
  2.2 Vendor Login: [ PASS / FAIL ]
  2.3 Admin Login: [ PASS / FAIL ]
  2.4 Error Handling: [ PASS / FAIL ]

Test Suite 3: Customer Order Flow
  3.1 Browse & Add to Cart: [ PASS / FAIL ]
  3.2 Cart Management: [ PASS / FAIL ]
  3.3 Cart Persistence: [ PASS / FAIL ]
  3.4 Checkout & Order: [ PASS / FAIL ]

Test Suite 4: Customer Order History
  4.1 View Own Orders: [ PASS / FAIL ]
  4.2 Data Isolation: [ PASS / FAIL ]
  4.3 Order Details: [ PASS / FAIL ]

Test Suite 5: Vendor Order Management
  5.1 Dashboard Filtering: [ PASS / FAIL ]
  5.2 Data Isolation: [ PASS / FAIL ]
  5.3 Status Update (Dashboard): [ PASS / FAIL ]
  5.4 Status Update (Orders): [ PASS / FAIL ]
  5.5 Complete Lifecycle: [ PASS / FAIL ]

Test Suite 6: Real-Time Sync
  6.1 Customer Sees Updates: [ PASS / FAIL ]
  6.2 Admin Sees Updates: [ PASS / FAIL ]

Test Suite 7: Admin Dashboard
  7.1 View All Orders: [ PASS / FAIL ]
  7.2 Search & Filter: [ PASS / FAIL ]
  7.3 Order Detail Panel: [ PASS / FAIL ]

Test Suite 8: Edge Cases
  8.1 Out of Stock: [ PASS / FAIL ]
  8.2 Empty Cart: [ PASS / FAIL ]
  8.3 Incomplete Form: [ PASS / FAIL ]
  8.4 Unauthenticated: [ PASS / FAIL ]

Overall Result: [ PASS / FAIL ]
Notes: ___________________________________________
```

---

## 🚀 Ready to Test!

All critical fixes have been applied. Follow this checklist to verify everything works end-to-end.
