import { useState } from 'react';
import { Search } from 'lucide-react';
import { demoUsers } from '@/data';
import Sidebar from '@/components/Sidebar';
import StatusChip from '@/components/StatusChip';
import { useToast } from '@/contexts/ToastContext';
import type { UserRole } from '@/types';

export default function AdminUsers() {
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [users, setUsers] = useState(demoUsers);

  const filteredUsers = users.filter(u => {
    const matchesSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'active' ? 'suspended' : 'active';
        addToast(`User ${newStatus === 'active' ? 'reactivated' : 'suspended'}`, newStatus === 'active' ? 'success' : 'info');
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const tabs: { label: string; value: UserRole | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Customer', value: 'customer' },
    { label: 'Vendor', value: 'vendor' },
    { label: 'Admin', value: 'admin' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Sidebar role="admin" />

      <main className="lg:ml-[240px] p-6 lg:p-8">
        <h1 className="text-[22px] font-bold text-[#111318] mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
          User Management
        </h1>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-[300px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B7C3]" />
            <input
              type="text" placeholder="Search users..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-[#E4E6ED] rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#E8321C]"
            />
          </div>
          <div className="flex gap-2">
            {tabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => setRoleFilter(tab.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  roleFilter === tab.value
                    ? 'bg-[#E8321C] text-white'
                    : 'bg-white text-[#6B7280] border border-[#E4E6ED] hover:border-[#E8321C]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[#E4E6ED] overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#F0F1F5] text-xs font-mono font-bold text-[#6B7280]">
            <div className="col-span-2">User</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-1">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Joined</div>
            <div className="col-span-2">Actions</div>
          </div>

          {filteredUsers.map(user => {
            const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
            return (
              <div
                key={user.id}
                className={`grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#E4E6ED] last:border-0 items-center ${
                  user.status === 'suspended' ? 'bg-[rgba(232,50,28,0.05)]' : ''
                }`}
              >
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E8321C] flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-[#111318] truncate">{user.name}</span>
                </div>
                <div className="col-span-3 text-sm text-[#6B7280] truncate">{user.email}</div>
                <div className="col-span-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#F7F8FA] text-[#6B7280] capitalize">
                    {user.role}
                  </span>
                </div>
                <div className="col-span-2">
                  <StatusChip status={user.status === 'suspended' ? 'suspended' : 'active'} />
                </div>
                <div className="col-span-2 text-sm font-mono text-[#6B7280]">{user.joinedDate}</div>
                <div className="col-span-2">
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                      user.status === 'active'
                        ? 'border-[#E4E6ED] text-[#111318] hover:border-[#E8321C] hover:text-[#E8321C]'
                        : 'bg-[#E8321C] text-white border-[#E8321C] hover:bg-[#C5290F]'
                    }`}
                  >
                    {user.status === 'active' ? 'Suspend' : 'Reactivate'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
