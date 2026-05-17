import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles,
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#E8321C] mb-4"></div>
          <p className="text-sm text-[#6B7280]">Loading...</p>
        </div>
      </div>
    );
  }

  // If auth is required but user is not logged in
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, check if user has one of them
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user's actual role
    if (user.role === 'vendor') {
      return <Navigate to="/vendor/dashboard" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/customer/home" replace />;
    }
  }

  // If vendor is pending approval, show message
  if (user?.role === 'vendor' && user.approvalStatus === 'pending') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-[#FFF0EE] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#E8321C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#111318] mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
            Pending Approval
          </h2>
          <p className="text-sm text-[#6B7280] mb-6">
            Your vendor account is pending approval from our admin team. You'll receive an email once your account is approved.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="text-sm text-[#E8321C] font-semibold hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // If vendor is rejected, show message
  if (user?.role === 'vendor' && user.approvalStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#111318] mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
            Application Rejected
          </h2>
          <p className="text-sm text-[#6B7280] mb-6">
            Unfortunately, your vendor application was not approved. Please contact support for more information.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="text-sm text-[#E8321C] font-semibold hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
