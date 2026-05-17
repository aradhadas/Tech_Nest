import { useLocation, useNavigate } from 'react-router-dom';
import { Check, ShoppingBag } from 'lucide-react';
import type { CartItem } from '@/types';

interface LocationState {
  orderIds?: string[];
  orderId?: string; // Keep for backward compatibility
  items: CartItem[];
  total: number;
}

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  if (!state) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>No order data found</p>
      </div>
    );
  }

  const { orderIds, orderId, items, total } = state;
  const displayOrderIds = orderIds || (orderId ? [orderId] : []);
  const multipleOrders = displayOrderIds.length > 1;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dotGrid3" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#E8321C" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotGrid3)" />
      </svg>

      <div
        className="relative z-10 bg-white rounded-2xl p-12 w-full max-w-[380px] mx-4 text-center"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
      >
        {/* Success circle */}
        <div
          className="w-20 h-20 rounded-full bg-[#E8321C] flex items-center justify-center mx-auto"
          style={{
            animation: 'scaleIn 400ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <Check size={36} className="text-white" />
        </div>

        <style>{`
          @keyframes scaleIn {
            from { transform: scale(0); }
            to { transform: scale(1); }
          }
        `}</style>

        <h2
          className="text-2xl font-bold text-[#111318] mt-5"
          style={{ fontFamily: 'Syne, sans-serif', animation: 'fadeInUp 300ms 100ms both' }}
        >
          {multipleOrders ? 'Orders Placed!' : 'Order Placed!'}
        </h2>

        {multipleOrders ? (
          <div className="mt-3 space-y-1">
            {displayOrderIds.map((id, index) => (
              <p
                key={id}
                className="text-sm font-bold text-[#E8321C]"
                style={{ fontFamily: 'JetBrains Mono, monospace', animation: `fadeInUp 300ms ${200 + index * 50}ms both` }}
              >
                #{id}
              </p>
            ))}
            <p className="text-xs text-[#6B7280] mt-2">
              Your cart contained items from multiple vendors, so we created separate orders.
            </p>
          </div>
        ) : (
          <p
            className="text-lg font-bold text-[#E8321C] mt-2"
            style={{ fontFamily: 'JetBrains Mono, monospace', animation: 'fadeInUp 300ms 200ms both' }}
          >
            #{displayOrderIds[0]}
          </p>
        )}

        {/* Items summary */}
        <div
          className="mt-5 space-y-2 text-left"
          style={{ animation: 'fadeInUp 300ms 250ms both' }}
        >
          {items.map(item => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span className="text-[#6B7280]">
                {item.quantity}× {item.product.name}
              </span>
              <span className="font-mono text-[#111318]">
                ৳{item.product.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div
          className="flex justify-between mt-5 pt-4 border-t border-[#E4E6ED]"
          style={{ animation: 'fadeInUp 300ms 300ms both' }}
        >
          <span className="text-base font-bold text-[#111318]">Total</span>
          <span className="text-xl font-bold text-[#E8321C]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            ৳{total}
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-3" style={{ animation: 'fadeInUp 300ms 350ms both' }}>
          <button
            onClick={() => navigate('/customer/orders')}
            className="w-full bg-[#E8321C] text-white py-3 rounded-lg font-bold hover:bg-[#C5290F] transition-colors flex items-center justify-center gap-2"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            View Orders
          </button>
          <button
            onClick={() => navigate('/customer/home')}
            className="w-full border border-[#E4E6ED] text-[#111318] py-3 rounded-lg font-bold hover:border-[#E8321C] transition-colors flex items-center justify-center gap-2"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            <ShoppingBag size={16} /> Continue Shopping
          </button>
        </div>

        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}
