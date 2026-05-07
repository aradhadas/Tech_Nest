import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PixelArcLogo from '@/components/PixelArcLogo';
import type { UserRole } from '@/types';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('customer');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, password, role);
    if (success) {
      if (role === 'customer') navigate('/customer/home');
      else if (role === 'vendor') navigate('/vendor/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Try customer@demo.com / vendor@demo.com / admin@demo.com');
    }
  };

  const roleHints: { role: UserRole; label: string; emoji: string }[] = [
    { role: 'customer', label: 'Customer', emoji: '\u{1F6CD}' },
    { role: 'vendor', label: 'Vendor', emoji: '\u{1F3EA}' },
    { role: 'admin', label: 'Admin', emoji: '\u{1F527}' },
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
        <div className="mt-4 pt-4 border-t border-[#E4E6ED]">
          <p className="text-[11px] text-[#B0B7C3] text-center mb-2">Quick Login (click to fill)</p>
          <div className="flex gap-2 justify-center">
            {roleHints.map(h => (
              <button
                key={h.role}
                onClick={() => {
                  const emailMap: Record<string, string> = {
                    customer: 'customer@demo.com',
                    vendor: 'vendor@demo.com',
                    admin: 'admin@demo.com',
                  };
                  quickLogin(emailMap[h.role], h.role);
                }}
                onMouseEnter={() => setRole(h.role)}
                className={`text-[11px] px-3 py-1.5 rounded-full border transition-colors ${
                  role === h.role
                    ? 'border-[#E8321C] bg-[#FFF0EE] text-[#E8321C]'
                    : 'border-[#E4E6ED] text-[#6B7280] hover:border-[#E8321C] hover:text-[#E8321C]'
                }`}
              >
                {h.emoji} {h.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
