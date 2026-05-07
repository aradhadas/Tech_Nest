import { sampleOrders } from '@/data';
import Sidebar from '@/components/Sidebar';
import StatusChip from '@/components/StatusChip';
import { useToast } from '@/contexts/ToastContext';

export default function VendorOrders() {
  const { addToast } = useToast();

  const updateStatus = (orderId: string, newStatus: string) => {
    const order = sampleOrders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus as any;
      addToast(`Order ${orderId} updated to ${newStatus}`, 'success');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Sidebar role="vendor" />

      <main className="lg:ml-[240px] p-6 pt-20 lg:p-8 lg:pt-8">
        <h1 className="text-[22px] font-bold text-[#111318] mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
          Orders
        </h1>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-xl border border-[#E4E6ED] overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#F0F1F5] text-xs font-mono font-bold text-[#6B7280]">
            <div className="col-span-2">Order ID</div>
            <div className="col-span-2">Customer</div>
            <div className="col-span-3">Product(s)</div>
            <div className="col-span-2">Total</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Update</div>
          </div>

          {sampleOrders.map(order => (
            <div key={order.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#E4E6ED] last:border-0 items-center">
              <div className="col-span-2 text-sm font-mono text-[#E8321C]">#{order.id}</div>
              <div className="col-span-2 text-sm text-[#111318]">{order.customerName}</div>
              <div className="col-span-3 text-sm text-[#6B7280]">
                {order.items.map(i => i.product.name).join(', ').slice(0, 30)}...
              </div>
              <div className="col-span-2 text-sm font-mono font-bold">৳{order.total}</div>
              <div className="col-span-1"><StatusChip status={order.status} /></div>
              <div className="col-span-2">
                <div className="relative">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="w-full text-sm border border-[#E4E6ED] rounded-lg px-3 py-2 focus:outline-none focus:border-[#E8321C] focus:ring-1 focus:ring-[#E8321C] bg-white appearance-none cursor-pointer"
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
          {sampleOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl border border-[#E4E6ED] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-mono font-bold text-[#E8321C]">#{order.id}</span>
                <StatusChip status={order.status} />
              </div>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Customer:</span>
                  <span className="text-[#111318]">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Products:</span>
                  <span className="text-[#111318] text-right truncate w-32">{order.items.map(i => i.product.name).join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Total:</span>
                  <span className="font-mono font-bold text-[#E8321C]">৳{order.total}</span>
                </div>
              </div>
              <div className="relative">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="w-full text-sm border border-[#E4E6ED] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#E8321C] focus:ring-1 focus:ring-[#E8321C] bg-white appearance-none cursor-pointer"
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
      </main>
    </div>
  );
}
