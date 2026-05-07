import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import Navbar from '@/components/Navbar';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleSave = () => {
    updateUser(form);
    addToast('Profile updated successfully', 'success');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-white">
      <Navbar searchQuery="" onSearchChange={() => {}} />

      <div className="max-w-[640px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white border border-[#E4E6ED] rounded-2xl p-8 sm:p-10">
          {/* Avatar */}
          <div className="flex justify-center relative">
            <div className="w-20 h-20 rounded-full bg-[#E8321C] flex items-center justify-center text-white text-2xl font-bold">
              {initials}
            </div>
            {/* Pixel accents */}
            <div className="absolute top-0 left-[42%] w-3 h-3 bg-[#E8321C] rounded-sm rotate-12 opacity-70 -translate-x-10 -translate-y-2" />
            <div className="absolute top-2 right-[42%] w-2.5 h-2.5 border-2 border-[#E8321C] rounded-sm -rotate-12 opacity-60 translate-x-10" />
            <div className="absolute bottom-0 left-[38%] w-2 h-2 bg-[#E8321C] rounded-sm rotate-45 opacity-50 -translate-x-6" />
          </div>

          {/* Form */}
          <div className="mt-8 space-y-4">
            <div>
              <label className="text-xs font-medium text-[#6B7280] mb-1 block">Full Name</label>
              <input
                type="text" value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-3 text-sm text-[#111318] focus:outline-none focus:border-[#E8321C] focus:ring-2 focus:ring-[#E8321C] transition-all"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B7280] mb-1 block">Email</label>
              <input
                type="email" value={user?.email || ''} readOnly
                className="w-full bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-3 text-sm text-[#B0B7C3] cursor-not-allowed"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B7280] mb-1 block">Phone</label>
              <input
                type="tel" value={form.phone}
                onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-3 text-sm text-[#111318] focus:outline-none focus:border-[#E8321C] focus:ring-2 focus:ring-[#E8321C] transition-all"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B7280] mb-1 block">Address</label>
              <textarea
                rows={3} value={form.address}
                onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
                className="w-full bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-3 text-sm text-[#111318] focus:outline-none focus:border-[#E8321C] focus:ring-2 focus:ring-[#E8321C] transition-all resize-none"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
          </div>

          {/* Role badge */}
          <div className="mt-5">
            <span className="inline-block bg-[#FFF0EE] text-[#E8321C] text-xs font-medium px-3 py-1 rounded-full capitalize">
              {user?.role}
            </span>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            className="mt-6 bg-[#E8321C] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#C5290F] transition-colors"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Save Changes
          </button>

          {user?.joinedDate && (
            <p className="mt-4 text-xs text-[#B0B7C3] font-mono">
              Joined: {user.joinedDate}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
