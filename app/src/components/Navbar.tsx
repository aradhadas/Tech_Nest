import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import PixelArcLogo from './PixelArcLogo';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Navbar({ searchQuery, onSearchChange }: NavbarProps) {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#E4E6ED]" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div className="max-w-[1440px] mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-12">
        <button onClick={() => navigate('/customer/home')} className="flex-shrink-0">
          <PixelArcLogo size="sm" />
        </button>

        <div className="hidden md:flex flex-1 max-w-[400px] mx-8">
          <div className="relative w-full">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0B7C3]" />
            <input
              type="text"
              placeholder="Search kits, components..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full bg-[#F7F8FA] border border-[#E4E6ED] rounded-full py-2.5 pl-10 pr-4 text-sm text-[#111318] placeholder-[#B0B7C3] focus:outline-none focus:border-[#E8321C] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/customer/cart')}
            className="relative p-2 text-[#111318] hover:text-[#E8321C] transition-colors"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#E8321C] text-white text-[10px] font-bold font-mono rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className="w-9 h-9 rounded-full bg-[#E8321C] flex items-center justify-center text-white text-sm font-semibold">
                {initials}
              </div>
              <ChevronDown size={14} className="text-[#6B7280] hidden sm:block" />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 top-12 z-50 bg-white border border-[#E4E6ED] rounded-xl shadow-lg py-2 min-w-[160px]">
                  <button
                    onClick={() => { navigate('/customer/profile'); setDropdownOpen(false); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#6B7280] hover:text-[#E8321C] hover:bg-[#FFF0EE] transition-colors"
                  >
                    <User size={15} />
                    Profile
                  </button>
                  <button
                    onClick={() => { logout(); navigate('/login'); setDropdownOpen(false); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#6B7280] hover:text-[#E8321C] hover:bg-[#FFF0EE] transition-colors"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
