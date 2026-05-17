import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Store, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PixelArcLogo from '@/components/PixelArcLogo';
import type { UserRole } from '@/types';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('customer');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    const result = await register(name, email, phone, password, role);
    if (result.success) {
      if (role === 'vendor') {
        navigate('/vendor/dashboard');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/home');
      }
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  const roles: { value: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    { value: 'customer', label: 'Customer', icon: <User size={20} strokeWidth={1.5} />, desc: 'Buy kits' },
    { value: 'vendor', label: 'Vendor', icon: <Store size={20} strokeWidth={1.5} />, desc: 'Sell products' },
    { value: 'admin', label: 'Admin', icon: <Shield size={20} strokeWidth={1.5} />, desc: 'Manage all' },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden py-8">
      {/* Pixel dot grid background */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dotGrid2" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#E8321C" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotGrid2)" />
      </svg>

      {/* Arc decoration */}
      <svg className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-20 pointer-events-none" viewBox="0 0 200 200">
        <path d="M20 180 Q100 20 180 180" stroke="#E8321C" strokeWidth="2" fill="none" strokeDasharray="8 4" />
      </svg>

      {/* Pixel accents */}
      <div className="absolute top-[15%] left-[12%] w-3.5 h-3.5 border-2 border-[#E8321C] rounded-sm rotate-12 opacity-60" />
      <div className="absolute top-[70%] right-[15%] w-4 h-4 bg-[#E8321C] rounded-sm -rotate-12 opacity-50" />

      <div
        className="relative z-10 bg-white rounded-2xl p-8 sm:p-10 w-full max-w-[440px] mx-4"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
      >
        <div className="flex flex-col items-center">
          <PixelArcLogo size="md" />
          <h2
            className="text-2xl font-bold text-[#111318] mt-4"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Create Account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            type="text" placeholder="Full Name"
            value={name} onChange={e => setName(e.target.value)}
            className="w-full bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-3 text-sm placeholder-[#B0B7C3] focus:outline-none focus:border-[#E8321C] focus:ring-2 focus:ring-[#E8321C] transition-all"
            style={{ fontFamily: 'Inter, sans-serif' }} required
          />
          <input
            type="email" placeholder="Email address"
            value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-3 text-sm placeholder-[#B0B7C3] focus:outline-none focus:border-[#E8321C] focus:ring-2 focus:ring-[#E8321C] transition-all"
            style={{ fontFamily: 'Inter, sans-serif' }} required
          />
          <input
            type="tel" placeholder="Phone number"
            value={phone} onChange={e => setPhone(e.target.value)}
            className="w-full bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-3 text-sm placeholder-[#B0B7C3] focus:outline-none focus:border-[#E8321C] focus:ring-2 focus:ring-[#E8321C] transition-all"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'} placeholder="Password"
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-3 text-sm placeholder-[#B0B7C3] focus:outline-none focus:border-[#E8321C] focus:ring-2 focus:ring-[#E8321C] transition-all pr-10"
              style={{ fontFamily: 'Inter, sans-serif' }} required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0B7C3]">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <input
            type="password" placeholder="Confirm Password"
            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
            className="w-full bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-3 text-sm placeholder-[#B0B7C3] focus:outline-none focus:border-[#E8321C] focus:ring-2 focus:ring-[#E8321C] transition-all"
            style={{ fontFamily: 'Inter, sans-serif' }} required
          />

          {/* Role Selector */}
          <div className="mt-4">
            <p className="text-xs text-[#6B7280] mb-2 font-medium">Select Account Type</p>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${
                    role === r.value
                      ? 'border-[#E8321C] bg-[#FFF0EE] text-[#E8321C]'
                      : 'border-[#E4E6ED] bg-white text-[#6B7280] hover:border-[#B0B7C3] hover:bg-[#F7F8FA]'
                  }`}
                >
                  <div className={`${role === r.value ? 'text-[#E8321C]' : 'text-[#8B93A6]'}`}>
                    {r.icon}
                  </div>
                  <span className={`text-xs font-bold ${role === r.value ? 'text-[#E8321C]' : 'text-[#111318]'}`}>
                    {r.label}
                  </span>
                  <span className="text-[10px] text-[#8B93A6] whitespace-nowrap">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-[#E8321C]">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#E8321C] text-white py-3.5 rounded-lg font-bold text-base hover:bg-[#C5290F] transition-colors mt-4"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-[13px] text-[#6B7280] mt-5">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-[#E8321C] font-semibold hover:underline">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
