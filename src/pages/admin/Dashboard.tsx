import { Users, Store, Clock, Package, ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import { demoUsers, products, sampleOrders } from '@/data';
import Sidebar from '@/components/Sidebar';
import StatusChip from '@/components/StatusChip';
import { useToast } from '@/contexts/ToastContext';

export default function AdminDashboard() {
  const { addToast } = useToast();
  const totalUsers = demoUsers.filter(u => u.role === 'customer').length;
  const totalVendors = demoUsers.filter(u => u.role === 'vendor').length;
  const pendingApprovals = demoUsers.filter(u => u.role === 'vendor' && u.approvalStatus === 'pending').length;
  const totalProducts = products.length;
  const totalOrders = sampleOrders.length;

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: '#2563EB' },
    { label: 'Total Vendors', value: totalVendors, icon: Store, color: '#E8321C' },
    { label: 'Pending Approvals', value: pendingApprovals, icon: Clock, color: '#D97706', badge: pendingApprovals > 0 },
    { label: 'Total Products', value: totalProducts, icon: Package, color: '#16A34A' },
    { label: 'Total Orders', value: totalOrders, icon: ShoppingCart, color: '#E8321C' },
  ];

  const pendingVendors = demoUsers.filter(u => u.role === 'vendor' && u.approvalStatus === 'pending');
  const recentActivity = sampleOrders.slice(0, 5);

  const handleApprove = (vendorId: string) => {
    const vendor = demoUsers.find(u => u.id === vendorId);
    if (vendor) {
      vendor.approvalStatus = 'approved';
      addToast(`Vendor ${vendor.storeName} approved`, 'success');
    }
  };

  const handleReject = (vendorId: string) => {
    const vendor = demoUsers.find(u => u.id === vendorId);
    if (vendor) {
      vendor.approvalStatus = 'rejected';
      addToast(`Vendor ${vendor.storeName} rejected`, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Sidebar role="admin" />

      <main className="lg:ml-[240px] p-6 pt-20 lg:p-8 lg:pt-8">
        <h1 className="text-2xl font-bold text-[#111318] mb-8" style={{ fontFamily: 'Syne, sans-serif' }}>
          Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl p-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '15' }}>
                    <Icon size={18} style={{ color: stat.color }} />
                  </div>
                  {'badge' in stat && stat.badge && (
                    <span className="bg-[#E8321C] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {stat.value}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6B7280]">{stat.label}</p>
                <p className="text-2xl font-bold text-[#111318] mt-0.5" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Pending Approvals */}
        {pendingVendors.length > 0 && (
          <div className="mt-8 bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 className="text-lg font-bold text-[#111318] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              Pending Approvals
            </h2>
            <div className="space-y-3">
              {pendingVendors.slice(0, 3).map(vendor => (
                <div key={vendor.id} className="flex items-center justify-between p-4 bg-[#F7F8FA] rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-[#111318]">{vendor.storeName}</p>
                    <p className="text-xs text-[#6B7280]">{vendor.email} · {vendor.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(vendor.id)}
                      className="flex items-center gap-1 px-3 py-1.5 border border-[#E4E6ED] rounded-lg text-xs font-medium text-[#111318] hover:border-[#E8321C] hover:text-[#E8321C] transition-colors"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                    <button
                      onClick={() => handleApprove(vendor.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#E8321C] rounded-lg text-xs font-medium text-white hover:bg-[#C5290F] transition-colors"
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Feed */}
        <div className="mt-8 bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 className="text-lg font-bold text-[#111318] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map(order => (
              <div key={order.id} className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#E8321C] mt-1.5 shrink-0" />
                <div>
                  <p className="text-[13px] text-[#111318]">
                    Order <span className="font-mono text-[#E8321C]">#{order.id}</span> placed by {order.customerName} —{' '}
                    <StatusChip status={order.status} />
                  </p>
                  <p className="text-[11px] text-[#B0B7C3] font-mono mt-0.5">{order.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
