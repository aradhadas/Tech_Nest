# 🔄 TechNest — Complete User Flows (All Fixed)

## Flow Diagram: Registration → Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│                    REGISTRATION FLOW                         │
└─────────────────────────────────────────────────────────────┘

User visits /register
        ↓
Fills form: name, email, phone, password
        ↓
Selects role: [Customer] [Vendor] [Admin]
        ↓
Clicks "Create Account"
        ↓
AuthContext.register() called
        ↓
    ┌───────────────────────────────────┐
    │ 1. Supabase Auth: signUp()       │
    │ 2. Insert into users table        │
    │    - id, name, email, phone       │
    │    - role (customer/vendor/admin) │
    │    - approval_status              │
    └───────────────────────────────────┘
        ↓
Returns { success: true/false, error?: string }
        ↓
    ✅ if (result.success)
        ↓
    ┌─────────────────────────────────┐
    │  Role-based redirect:           │
    │  • Vendor  → /vendor/dashboard  │
    │  • Admin   → /admin/dashboard   │
    │  • Customer → /customer/home    │
    └─────────────────────────────────┘
```

---

## Flow Diagram: Login → Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│                      LOGIN FLOW                              │
└─────────────────────────────────────────────────────────────┘

User visits /login
        ↓
Enters email & password
        ↓
Clicks "Sign In"
        ↓
AuthContext.login() called
        ↓
    ┌───────────────────────────────────┐
    │ Supabase Auth: signInWithPassword │
    │ Fetch user profile from users     │
    │ Set user in context               │
    └───────────────────────────────────┘
        ↓
Returns { success: true/false, error?: string }
        ↓
    ✅ if (result.success)
        ↓
    useEffect detects user change
        ↓
    ┌─────────────────────────────────┐
    │  Check user.role:               │
    │  • vendor  → /vendor/dashboard  │
    │  • admin   → /admin/dashboard   │
    │  • customer → /customer/home    │
    └─────────────────────────────────┘
```

---

## Flow Diagram: Customer Places Order

```
┌─────────────────────────────────────────────────────────────┐
│                   ORDER PLACEMENT FLOW                       │
└─────────────────────────────────────────────────────────────┘

Customer browses /customer/home
        ↓
Clicks product → ProductDetailPanel opens
        ↓
Adjusts quantity → Clicks "Add to Cart"
        ↓
    ┌───────────────────────────────────┐
    │ CartContext.addToCart()           │
    │ • Adds to items array             │
    │ • Saves to localStorage           │
    └───────────────────────────────────┘
        ↓
Customer clicks cart icon → /customer/cart
        ↓
Reviews items, adjusts quantities
        ↓
Clicks "Proceed to Checkout" → /customer/checkout
        ↓
Fills delivery form (name, phone, address)
        ↓
Clicks "Place Order"
        ↓
    ┌───────────────────────────────────┐
    │ Extract vendorId from cart items  │
    │ vendorId = items[0].product.vendorId │
    └───────────────────────────────────┘
        ↓
    ┌───────────────────────────────────┐
    │ useOrders.createOrder()           │
    │ • customer_id: user?.id           │
    │ • customer_name: form.name        │
    │ • items: cart items               │
    │ • total: calculated price         │
    │ • status: 'pending'               │
    │ • vendor_id: vendorId ✅          │
    │ • delivery_address, phone         │
    └───────────────────────────────────┘
        ↓
    Insert into Supabase orders table
        ↓
    Update product stock (decrement)
        ↓
    Clear cart (memory + localStorage)
        ↓
    Navigate to /customer/confirmation
```

---

## Flow Diagram: Vendor Manages Orders

```
┌─────────────────────────────────────────────────────────────┐
│                  VENDOR ORDER MANAGEMENT                     │
└─────────────────────────────────────────────────────────────┘

Vendor logs in → redirected to /vendor/dashboard
        ↓
    ┌───────────────────────────────────┐
    │ useOrders(undefined, user?.id)    │
    │ • Fetches orders WHERE            │
    │   vendor_id = user.id ✅          │
    │ • Real-time subscription active   │
    └───────────────────────────────────┘
        ↓
Dashboard shows:
    • Total Products
    • Pending Orders (status='pending')
    • Completed Orders (status='delivered')
    • Recent Orders table
        ↓
Vendor sees new order with status "Pending"
        ↓
Vendor changes status dropdown to "Processing"
        ↓
    ┌───────────────────────────────────┐
    │ handleStatusUpdate() called       │
    │ • updateOrderStatus(orderId, status) │
    │ • Supabase: UPDATE orders         │
    │   SET status = 'processing'       │
    │   WHERE id = orderId              │
    └───────────────────────────────────┘
        ↓
    Toast notification: "Order updated"
        ↓
    Real-time sync triggers refetch
        ↓
    All connected clients see update
        ↓
Vendor updates to "Shipped" → same flow
        ↓
Vendor updates to "Delivered" → same flow
```

---

## Flow Diagram: Customer Sees Status Updates

```
┌─────────────────────────────────────────────────────────────┐
│                 CUSTOMER ORDER TRACKING                      │
└─────────────────────────────────────────────────────────────┘

Customer visits /customer/orders
        ↓
    ┌───────────────────────────────────┐
    │ useOrders(user?.id)               │
    │ • Fetches orders WHERE            │
    │   customer_id = user.id ✅        │
    │ • Real-time subscription active   │
    └───────────────────────────────────┘
        ↓
OrderHistory page shows all customer's orders
        ↓
    ┌─────────────────────────────────┐
    │ Order #TN-123456                │
    │ Status: [Pending] 🟡            │
    │ Items: 2 item(s)                │
    │ Total: ৳2,500                   │
    │ [Expand ▼]                      │
    └─────────────────────────────────┘
        ↓
Vendor updates order status to "Processing"
        ↓
    ┌───────────────────────────────────┐
    │ Supabase real-time event fired   │
    │ • postgres_changes on orders     │
    │ • useOrders refetches data       │
    └───────────────────────────────────┘
        ↓
    ┌─────────────────────────────────┐
    │ Order #TN-123456                │
    │ Status: [Processing] 🔵 ← Updated! │
    │ Items: 2 item(s)                │
    │ Total: ৳2,500                   │
    │ [Expand ▼]                      │
    └─────────────────────────────────┘
        ↓
Customer sees live update (no refresh needed)
```

---

## Flow Diagram: Admin Oversight

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                           │
└─────────────────────────────────────────────────────────────┘

Admin logs in → redirected to /admin/dashboard
        ↓
    ┌───────────────────────────────────┐
    │ useOrders() — NO FILTERS          │
    │ • Fetches ALL orders              │
    │ • Real-time subscription active   │
    └───────────────────────────────────┘
        ↓
Dashboard shows:
    • Total Users
    • Total Vendors
    • Pending Approvals
    • Total Products
    • Total Orders
    • Recent Activity Feed
        ↓
Admin clicks "All Orders" → /admin/orders
        ↓
    ┌───────────────────────────────────┐
    │ Search: [Order ID or Customer]    │
    │ Filter: [All Status ▼]            │
    │                                   │
    │ Order #TN-123456 | Customer A     │
    │ Order #TN-123457 | Customer B     │
    │ Order #TN-123458 | Customer C     │
    └───────────────────────────────────┘
        ↓
Admin clicks order → Detail panel opens
        ↓
    ┌─────────────────────────────────┐
    │ Order Details                   │
    │ ─────────────────────────────   │
    │ Order ID: #TN-123456            │
    │ Status: [Processing] 🔵         │
    │ Customer: John Doe              │
    │ Delivery: 123 Main St           │
    │ Phone: +880 1234567890          │
    │                                 │
    │ Items:                          │
    │ • 2× LED Strip Kit - ৳1,200     │
    │ • 1× Power Supply - ৳800        │
    │                                 │
    │ Total: ৳2,000                   │
    └─────────────────────────────────┘
        ↓
Admin sees all orders from all vendors and customers
```

---

## Data Flow: Real-Time Sync

```
┌─────────────────────────────────────────────────────────────┐
│                  REAL-TIME SYNCHRONIZATION                   │
└─────────────────────────────────────────────────────────────┘

    Vendor updates order status
            ↓
    ┌───────────────────────────────────┐
    │ Supabase: UPDATE orders           │
    │ SET status = 'shipped'            │
    │ WHERE id = 'TN-123456'            │
    └───────────────────────────────────┘
            ↓
    ┌───────────────────────────────────┐
    │ Supabase broadcasts event:        │
    │ • table: 'orders'                 │
    │ • event: 'UPDATE'                 │
    │ • record: { id, status, ... }     │
    └───────────────────────────────────┘
            ↓
    ┌─────────────────────────────────────────────┐
    │ All subscribed clients receive event:       │
    │ • Customer's OrderHistory page              │
    │ • Vendor's Dashboard                        │
    │ • Vendor's Orders page                      │
    │ • Admin's Orders page                       │
    │ • Admin's Dashboard                         │
    └─────────────────────────────────────────────┘
            ↓
    Each client calls fetchOrders()
            ↓
    UI updates automatically (no manual refresh)
```

---

## Cart Persistence Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   CART PERSISTENCE                           │
└─────────────────────────────────────────────────────────────┘

User adds item to cart
        ↓
    ┌───────────────────────────────────┐
    │ CartContext.addToCart()           │
    │ • Updates items state             │
    └───────────────────────────────────┘
        ↓
    useEffect triggered (items changed)
        ↓
    ┌───────────────────────────────────┐
    │ localStorage.setItem(             │
    │   'technest_cart',                │
    │   JSON.stringify(items)           │
    │ )                                 │
    └───────────────────────────────────┘
        ↓
User refreshes page
        ↓
    ┌───────────────────────────────────┐
    │ CartContext initializes           │
    │ const [items] = useState(() => {  │
    │   const stored = localStorage     │
    │     .getItem('technest_cart')     │
    │   return stored ? JSON.parse(stored) : [] │
    │ })                                │
    └───────────────────────────────────┘
        ↓
    Cart restored with all items ✅
```

---

## 🎯 Key Improvements Summary

| Flow | Before | After |
|------|--------|-------|
| **Registration** | Always truthy check | ✅ Proper `result.success` check |
| **Login Redirect** | Always `/customer/home` | ✅ Role-based redirect |
| **Vendor Orders** | Sees ALL orders | ✅ Filtered by `vendor_id` |
| **Customer Orders** | Sees ALL orders | ✅ Filtered by `customer_id` |
| **Order Creation** | `vendor_id = null` | ✅ Extracted from products |
| **Vendor Dashboard** | Status not saved | ✅ Persisted to Supabase |
| **Cart** | Lost on refresh | ✅ Saved to localStorage |

---

## ✅ All Critical Flows Working!

Every user journey now works end-to-end with proper data isolation, real-time sync, and persistence.
