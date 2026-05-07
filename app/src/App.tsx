import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    // Redirect to appropriate home
    if (user.role === 'customer') return <Navigate to="/customer/home" replace />;
    if (user.role === 'vendor') return <Navigate to="/vendor/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer routes */}
        <Route path="/customer/home" element={<ProtectedRoute allowedRole="customer"><CustomerHome /></ProtectedRoute>} />
        <Route path="/customer/cart" element={<ProtectedRoute allowedRole="customer"><Cart /></ProtectedRoute>} />
        <Route path="/customer/checkout" element={<ProtectedRoute allowedRole="customer"><Checkout /></ProtectedRoute>} />
        <Route path="/customer/confirmation" element={<ProtectedRoute allowedRole="customer"><OrderConfirmation /></ProtectedRoute>} />
        <Route path="/customer/orders" element={<ProtectedRoute allowedRole="customer"><OrderHistory /></ProtectedRoute>} />
        <Route path="/customer/profile" element={<ProtectedRoute allowedRole="customer"><Profile /></ProtectedRoute>} />

        {/* Vendor routes */}
        <Route path="/vendor/dashboard" element={<ProtectedRoute allowedRole="vendor"><VendorDashboard /></ProtectedRoute>} />
        <Route path="/vendor/products" element={<ProtectedRoute allowedRole="vendor"><VendorProducts /></ProtectedRoute>} />
        <Route path="/vendor/orders" element={<ProtectedRoute allowedRole="vendor"><VendorOrders /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin"><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/vendors" element={<ProtectedRoute allowedRole="admin"><AdminVendors /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute allowedRole="admin"><AdminCategories /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute allowedRole="admin"><AdminOrders /></ProtectedRoute>} />

        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
