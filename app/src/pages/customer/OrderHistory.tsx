import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { sampleOrders } from '@/data';
import Navbar from '@/components/Navbar';
import StatusChip from '@/components/StatusChip';

export default function OrderHistory() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Navbar searchQuery="" onSearchChange={() => {}} />

      <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1
          className="text-[28px] font-bold text-[#111318]"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          My Orders
        </h1>

        <div className="mt-6 border border-[#E4E6ED] rounded-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#F0F1F5] text-xs font-mono font-bold text-[#6B7280]">
            <div className="col-span-3">Order ID</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Items</div>
            <div className="col-span-2">Total</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1"></div>
          </div>

          {/* Rows */}
          {sampleOrders.map(order => {
            const isExpanded = expandedOrder === order.id;
            return (
              <div key={order.id} className="border-b border-[#E4E6ED] last:border-0">
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#F7F8FA] transition-colors text-left"
                >
                  <div
                    className="col-span-3 text-sm font-bold text-[#E8321C]"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    #{order.id}
                  </div>
                  <div className="col-span-2 text-sm text-[#6B7280]">{order.date}</div>
                  <div className="col-span-2 text-sm text-[#111318]">{order.items.length} item(s)</div>
                  <div
                    className="col-span-2 text-sm font-bold text-[#111318]"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    ৳{order.total}
                  </div>
                  <div className="col-span-2">
                    <StatusChip status={order.status} />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    {isExpanded ? <ChevronUp size={16} className="text-[#6B7280]" /> : <ChevronDown size={16} className="text-[#6B7280]" />}
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-6 pb-4 pl-12 bg-[#F7F8FA]">
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-[#6B7280]">
                            {item.quantity}× {item.product.name}
                          </span>
                          <span className="font-mono text-[#111318]">
                            ৳{item.product.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                    {order.deliveryAddress && (
                      <p className="text-xs text-[#6B7280] mt-3">
                        <span className="font-medium">Delivery:</span> {order.deliveryAddress}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
