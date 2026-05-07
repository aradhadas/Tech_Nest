import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { sampleOrders } from '@/data';
import Sidebar from '@/components/Sidebar';
import StatusChip from '@/components/StatusChip';
import type { Order } from '@/types';

export default function AdminOrders() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = sampleOrders.filter(o => {
    const matchesSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || (o.customerName || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Sidebar role="admin" />

      <main className="lg:ml-[240px] p-6 lg:p-8">
        <h1 className="text-[22px] font-bold text-[#111318] mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
          All Orders
        </h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-[300px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B7C3]" />
            <input
              type="text" placeholder="Search orders..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-[#E4E6ED] rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#E8321C]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white border border-[#E4E6ED] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8321C]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[#E4E6ED] overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#F0F1F5] text-xs font-mono font-bold text-[#6B7280]">
            <div className="col-span-2">Order ID</div>
            <div className="col-span-2">Customer</div>
            <div className="col-span-2">Items</div>
            <div className="col-span-2">Total</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Date</div>
          </div>

          {filteredOrders.map(order => (
            <button
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="w-full grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#E4E6ED] last:border-0 items-center hover:bg-[#F7F8FA] transition-colors text-left"
            >
              <div className="col-span-2 text-sm font-mono text-[#E8321C]">#{order.id}</div>
              <div className="col-span-2 text-sm text-[#111318]">{order.customerName}</div>
              <div className="col-span-2 text-sm text-[#6B7280]">{order.items.length} item(s)</div>
              <div className="col-span-2 text-sm font-mono font-bold">৳{order.total}</div>
              <div className="col-span-2"><StatusChip status={order.status} /></div>
              <div className="col-span-2 text-sm text-[#6B7280]">{order.date}</div>
            </button>
          ))}
        </div>
      </main>

      {/* Detail Panel */}
      {selectedOrder && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[99]" onClick={() => setSelectedOrder(null)} />
          <div
            className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-white z-[100] overflow-y-auto"
            style={{ animation: 'slideInRight 300ms cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#111318]" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Order Details
                </h2>
                <button onClick={() => setSelectedOrder(null)} className="p-2 border border-[#E4E6ED] rounded-lg hover:border-[#E8321C]">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[#6B7280]">Order ID</p>
                  <p className="text-lg font-mono text-[#E8321C] font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    #{selectedOrder.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Status</p>
                  <StatusChip status={selectedOrder.status} />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Customer</p>
                  <p className="text-sm font-medium text-[#111318]">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Delivery Address</p>
                  <p className="text-sm text-[#111318]">{selectedOrder.deliveryAddress || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Phone</p>
                  <p className="text-sm font-mono text-[#111318]">{selectedOrder.deliveryPhone || 'N/A'}</p>
                </div>

                <div className="border-t border-[#E4E6ED] pt-4">
                  <p className="text-xs text-[#6B7280] mb-2">Items</p>
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between py-2">
                      <span className="text-sm text-[#111318]">{item.quantity}× {item.product.name}</span>
                      <span className="text-sm font-mono font-bold">৳{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#E4E6ED] pt-4 flex justify-between">
                  <span className="text-base font-bold text-[#111318]">Total</span>
                  <span className="text-xl font-bold text-[#E8321C]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    ৳{selectedOrder.total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
