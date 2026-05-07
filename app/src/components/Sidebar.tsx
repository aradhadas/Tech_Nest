import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Store, FolderOpen, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PixelArcLogo from './PixelArcLogo';
import { useState } from 'react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const vendorNav: NavItem[] = [
  { label: 'Dashboard', path: '/vendor/dashboard', icon: LayoutDashboard },
  { label: 'Products', path: '/vendor/products', icon: Package },
  { label: 'Orders', path: '/vendor/orders', icon: ShoppingCart },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Vendors', path: '/admin/vendors', icon: Store },
  { label: 'Categories', path: '/admin/categories', icon: FolderOpen },
  { label: 'All Orders', path: '/admin/orders', icon: ShoppingCart },
];

interface SidebarProps {
  role: 'vendor' | 'admin';
}

export default function Sidebar({ role }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = role === 'vendor' ? vendorNav : adminNav;

  const navContent = (
    <>
      <div className="p-5 pb-4">
        <PixelArcLogo size="sm" dark />
      </div>

      <nav className="flex-1 px-2 py-2 space-y-1">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm transition-all duration-200"
              style={{
                fontFamily: 'Inter, sans-serif',
                color: isActive ? '#F7F8FA' : '#B0B7C3',
                backgroundColor: isActive ? 'rgba(232,50,28,0.10)' : 'transparent',
                borderLeft: isActive ? '3px solid #E8321C' : '3px solid transparent',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = '#F7F8FA';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#B0B7C3';
                }
              }}
            >
              <Icon size={18} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 mt-auto">
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-[#B0B7C3] hover:text-[#F7F8FA] hover:bg-[rgba(255,255,255,0.05)] transition-all"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-[60] p-2 bg-[#1C1F2A] rounded-lg text-[#F7F8FA] lg:hidden"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-[55] lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[240px] bg-[#1C1F2A] flex flex-col z-[56] transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}
