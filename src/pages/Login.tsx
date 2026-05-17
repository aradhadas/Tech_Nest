import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Store, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PixelArcLogo from '@/components/PixelArcLogo';
import type { UserRole } from '@/types';

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('customer');
  const [error, setError] = useState('');

  // Redirect based on user role after login
  useEffect(() => {
    if (user) {
      if (user.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/home');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    
    if (result.success) {
      // Wait a moment for user context to be set
      setTimeout(() => {
        // This will be handled by the useEffect below
      }, 100);
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  const roleHints: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: 'customer', label: 'Customer', icon: <User size={13} /> },
    { role: 'vendor', label: 'Vendor', icon: <Store size={13} /> },
    { role: 'admin', label: 'Admin', icon: <Shield size={13} /> },
  ];

  const quickLogin = (demoEmail: string, demoRole: UserRole) => {
    setEmail(demoEmail);
    setRole(demoRole);
    setPassword('password');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Pixel dot grid background */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dotGrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#E8321C" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotGrid)" />
      </svg>

      {/* Arc decoration */}
      <svg className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-20 pointer-events-none" viewBox="0 0 200 200">
        <path d="M20 180 Q100 20 180 180" stroke="#E8321C" strokeWidth="2" fill="none" strokeDasharray="8 4" />
      </svg>

      {/* Pixel square accents */}
      <div className="absolute top-[20%] left-[15%] w-4 h-4 bg-[#E8321C] rounded-sm rotate-12 opacity-60" />
      <div className="absolute top-[25%] right-[18%] w-3 h-3 border-2 border-[#E8321C] rounded-sm -rotate-12 opacity-60" />
      <div className="absolute bottom-[30%] left-[20%] w-2.5 h-2.5 bg-[#E8321C] rounded-sm rotate-45 opacity-50" />
      <div className="absolute top-[60%] right-[12%] w-3.5 h-3.5 border-2 border-[#E8321C] rounded-sm rotate-15 opacity-50" />

      {/* Login Card */}
      <div
        className="relative z-10 bg-white rounded-2xl p-10 w-full max-w-[380px] mx-4"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
      >
        <div className="flex flex-col items-center">
          <PixelArcLogo size="md" />
          <p className="text-[13px] text-[#6B7280] mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Your Electronics Project Hub
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-3">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-3 text-sm text-[#111318] placeholder-[#B0B7C3] focus:outline-none focus:border-[#E8321C] focus:ring-2 focus:ring-[#E8321C] transition-all"
            style={{ fontFamily: 'Inter, sans-serif' }}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-3 text-sm text-[#111318] placeholder-[#B0B7C3] focus:outline-none focus:border-[#E8321C] focus:ring-2 focus:ring-[#E8321C] transition-all pr-10"
              style={{ fontFamily: 'Inter, sans-serif' }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0B7C3] hover:text-[#6B7280]"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-[#E8321C]">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#E8321C] text-white py-3.5 rounded-lg font-bold text-base hover:bg-[#C5290F] transition-colors mt-2"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-[13px] text-[#6B7280] mt-5">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-[#E8321C] font-semibold hover:underline"
          >
            Register
          </button>
        </p>

        {/* Demo login buttons */}
        <div className="mt-5 pt-5 border-t border-[#E4E6ED]">
          <p className="text-[11px] font-semibold text-[#8B93A6] tracking-wider uppercase text-center mb-3">Quick Sign In Form</p>
          <div className="flex rounded-lg border border-[#E4E6ED] p-1 bg-[#F7F8FA]">
            {roleHints.map(h => (
              <button
                key={h.role}
                type="button"
                onClick={() => {
                  const emailMap: Record<string, string> = {
                    customer: 'customer@demo.com',
                    vendor: 'vendor@demo.com',
                    admin: 'admin@demo.com',
                  };
                  quickLogin(emailMap[h.role], h.role);
                }}
                onMouseEnter={() => setRole(h.role)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-semibold transition-all duration-200 ${
                  role === h.role
                    ? 'bg-white text-[#111318] shadow-sm ring-1 ring-black/5'
                    : 'text-[#6B7280] hover:text-[#111318]'
                }`}
              >
                {h.icon}
                {h.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
