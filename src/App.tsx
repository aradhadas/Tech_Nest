import { Routes, Route, Navigate } from 'react-router-dom';
import ToastContainer from '@/components/ToastContainer';

// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';

// Customer pages
import CustomerHome from '@/pages/customer/Home';
import Cart from '@/pages/customer/Cart';
import Checkout from '@/pages/customer/Checkout';
import OrderConfirmation from '@/pages/customer/OrderConfirmation';
import OrderHistory from '@/pages/customer/OrderHistory';
import Profile from '@/pages/customer/Profile';

// Vendor pages
import VendorDashboard from '@/pages/vendor/Dashboard';
import VendorProducts from '@/pages/vendor/Products';
import VendorOrders from '@/pages/vendor/Orders';

// Admin pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminUsers from '@/pages/admin/Users';
import AdminVendors from '@/pages/admin/Vendors';
import AdminCategories from '@/pages/admin/Categories';
import AdminOrders from '@/pages/admin/Orders';

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer routes - No auth required for now */}
        <Route path="/customer/home" element={<CustomerHome />} />
        <Route path="/customer/cart" element={<Cart />} />
        <Route path="/customer/checkout" element={<Checkout />} />
        <Route path="/customer/confirmation" element={<OrderConfirmation />} />
        <Route path="/customer/orders" element={<OrderHistory />} />
        <Route path="/customer/profile" element={<Profile />} />

        {/* Vendor routes - No auth required for now */}
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/products" element={<VendorProducts />} />
        <Route path="/vendor/orders" element={<VendorOrders />} />

        {/* Admin routes - No auth required for now */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/vendors" element={<AdminVendors />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/orders" element={<AdminOrders />} />

        {/* Redirect root to customer home */}
        <Route path="/" element={<Navigate to="/customer/home" replace />} />
        <Route path="*" element={<Navigate to="/customer/home" replace />} />
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
