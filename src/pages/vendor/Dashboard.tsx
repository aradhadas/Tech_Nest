import { ShoppingBag, Package, Clock, CheckCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import Sidebar from '@/components/Sidebar';
import StatusChip from '@/components/StatusChip';

export default function VendorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { orders, updateOrderStatus } = useOrders(undefined, user?.id);
  const { products } = useProducts();
  
  // Filter products by vendor
  const vendorProducts = products.filter(p => p.vendorId === user?.id);

  const stats = [
    { label: 'Total Products', value: vendorProducts.length, icon: ShoppingBag, color: '#E8321C' },
    { label: 'Active', value: vendorProducts.filter(p => p.status === 'active').length, icon: Package, color: '#2563EB' },
    { label: 'Pending Orders', value: orders.filter(o => o.status === 'pending').length, icon: Clock, color: '#D97706' },
    { label: 'Completed', value: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle, color: '#16A34A' },
  ];

  const recentOrders = orders.slice(0, 5);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const result = await updateOrderStatus(orderId, newStatus as any);
    if (result.error) {
      addToast(result.error, 'error');
      return;
    }
    addToast(`Order ${orderId} updated to ${newStatus}`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Sidebar role="vendor" />

      <main className="lg:ml-[240px] p-6 pt-20 lg:p-8 lg:pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center items-start justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-[#111318]" style={{ fontFamily: 'Syne, sans-serif' }}>
            Dashboard
          </h1>
          <button
            onClick={() => navigate('/vendor/products')}
            className="w-full sm:w-auto bg-[#E8321C] text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#C5290F] transition-colors flex items-center justify-center sm:justify-start gap-2"
          >
            <Plus size={16} /> Add New Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-6"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: stat.color + '15' }}
                >
                  <Icon size={20} style={{ color: stat.color }} />
                </div>
                <p className="text-sm text-[#6B7280]">{stat.label}</p>
                <p
                  className="text-[28px] font-bold text-[#111318] mt-1"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Recent Orders */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#111318]" style={{ fontFamily: 'Syne, sans-serif' }}>
              Recent Orders
            </h2>
            <button
              onClick={() => navigate('/vendor/orders')}
              className="text-sm text-[#E8321C] font-medium hover:underline"
            >
              View All
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-xl border border-[#E4E6ED] overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#F0F1F5] text-xs font-mono font-bold text-[#6B7280]">
              <div className="col-span-2">Order ID</div>
              <div className="col-span-2">Customer</div>
              <div className="col-span-2">Items</div>
              <div className="col-span-2">Total</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Action</div>
            </div>
            {recentOrders.map(order => (
              <div key={order.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#E4E6ED] last:border-0 items-center">
                <div className="col-span-2 text-sm font-mono text-[#E8321C]">#{order.id}</div>
                <div className="col-span-2 text-sm text-[#111318]">{order.customerName}</div>
                <div className="col-span-2 text-sm text-[#6B7280]">{order.items.length} item(s)</div>
                <div className="col-span-2 text-sm font-mono font-bold">৳{order.total}</div>
                <div className="col-span-2"><StatusChip status={order.status} /></div>
                <div className="col-span-2">
                <div className="relative">
                  <select
                    className="w-full text-sm border border-[#E4E6ED] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#E8321C] bg-white appearance-none cursor-pointer"
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#6B7280]">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Card Layout */}
          <div className="lg:hidden space-y-3">
            {recentOrders.map(order => (
              <div key={order.id} className="bg-white rounded-xl border border-[#E4E6ED] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-mono font-bold text-[#E8321C]">#{order.id}</span>
                  <StatusChip status={order.status} />
                </div>
                <div className="space-y-2 text-sm mb-3">
                  <div className="flex justify-between"><span className="text-[#6B7280]">Customer:</span> <span className="text-[#111318]">{order.customerName}</span></div>
                  <div className="flex justify-between"><span className="text-[#6B7280]">Items:</span> <span className="text-[#111318]">{order.items.length}</span></div>
                  <div className="flex justify-between"><span className="text-[#6B7280]">Total:</span> <span className="font-mono font-bold text-[#E8321C]">৳{order.total}</span></div>
                </div>
                <div className="relative">
                  <select
                    className="w-full text-sm border border-[#E4E6ED] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#E8321C] bg-white appearance-none cursor-pointer"
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#6B7280]">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
