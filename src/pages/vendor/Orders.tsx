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

      <main className="lg:ml-[240px] p-6 lg:p-8">
        <h1 className="text-[22px] font-bold text-[#111318] mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
          Orders
        </h1>

        <div className="bg-white rounded-xl border border-[#E4E6ED] overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#F0F1F5] text-xs font-mono font-bold text-[#6B7280]">
            <div className="col-span-2">Order ID</div>
            <div className="col-span-2">Customer</div>
            <div className="col-span-2">Product(s)</div>
            <div className="col-span-2">Total</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Update</div>
          </div>

          {sampleOrders.map(order => (
            <div key={order.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#E4E6ED] last:border-0 items-center">
              <div className="col-span-2 text-sm font-mono text-[#E8321C]">#{order.id}</div>
              <div className="col-span-2 text-sm text-[#111318]">{order.customerName}</div>
              <div className="col-span-2 text-sm text-[#6B7280]">
                {order.items.map(i => i.product.name).join(', ').slice(0, 30)}...
              </div>
              <div className="col-span-2 text-sm font-mono font-bold">৳{order.total}</div>
              <div className="col-span-2"><StatusChip status={order.status} /></div>
              <div className="col-span-2">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="text-xs border border-[#E4E6ED] rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#E8321C] bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
