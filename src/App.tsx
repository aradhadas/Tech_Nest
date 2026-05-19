import { Routes, Route, Navigate } from 'react-router-dom';
import ToastContainer from '@/components/ToastContainer';
import ProtectedRoute from '@/components/ProtectedRoute';

// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import TestLogin from '@/pages/TestLogin';

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
        <Route path="/test-login" element={<TestLogin />} />

        {/* Customer routes - Public access for browsing */}
        <Route path="/customer/home" element={<CustomerHome />} />
        <Route path="/customer/cart" element={<Cart />} />
        <Route 
          path="/customer/checkout" 
          element={
            <ProtectedRoute requireAuth={false}>
              <Checkout />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/customer/confirmation" 
          element={
            <ProtectedRoute requireAuth={false}>
              <OrderConfirmation />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/customer/orders" 
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <OrderHistory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/customer/profile" 
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Profile />
            </ProtectedRoute>
          } 
        />

        {/* Vendor routes - Protected */}
        <Route 
          path="/vendor/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/vendor/products" 
          element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorProducts />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/vendor/orders" 
          element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorOrders />
            </ProtectedRoute>
          } 
        />

        {/* Admin routes - Protected */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/vendors" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminVendors />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/categories" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminCategories />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/orders" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminOrders />
            </ProtectedRoute>
          } 
        />

        {/* Redirect public entry points to authentication */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
