import { ShoppingBag, Package, Clock, CheckCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { products, sampleOrders } from '@/data';
import Sidebar from '@/components/Sidebar';
import StatusChip from '@/components/StatusChip';

export default function VendorDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Products', value: products.length, icon: ShoppingBag, color: '#E8321C' },
    { label: 'Active', value: products.filter(p => p.status === 'active').length, icon: Package, color: '#2563EB' },
    { label: 'Pending Orders', value: sampleOrders.filter(o => o.status === 'pending').length, icon: Clock, color: '#D97706' },
    { label: 'Completed', value: sampleOrders.filter(o => o.status === 'delivered').length, icon: CheckCircle, color: '#16A34A' },
  ];

  const recentOrders = sampleOrders.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Sidebar role="vendor" />

      <main className="lg:ml-[240px] p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[#111318]" style={{ fontFamily: 'Syne, sans-serif' }}>
            Dashboard
          </h1>
          <button
            onClick={() => navigate('/vendor/products')}
            className="bg-[#E8321C] text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#C5290F] transition-colors flex items-center gap-2"
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

          <div className="bg-white rounded-xl border border-[#E4E6ED] overflow-hidden">
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
                  <select
                    className="text-xs border border-[#E4E6ED] rounded-lg px-2 py-1 focus:outline-none focus:border-[#E8321C]"
                    defaultValue={order.status}
                    onChange={(e) => {
                      order.status = e.target.value as any;
                    }}
                  >
                    <option value="pending">Processing</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
