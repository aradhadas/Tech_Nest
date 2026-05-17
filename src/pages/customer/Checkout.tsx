import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/contexts/ToastContext';
import Navbar from '@/components/Navbar';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const { addToast } = useToast();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    postalCode: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const fullAddress = `${form.address}, ${form.city || ''} ${form.postalCode || ''}`.trim();
      
      // Group cart items by vendor
      const itemsByVendor = items.reduce((acc, item) => {
        const vendorId = item.product.vendorId || 'no-vendor';
        if (!acc[vendorId]) {
          acc[vendorId] = [];
        }
        acc[vendorId].push(item);
        return acc;
      }, {} as Record<string, typeof items>);

      // Create separate order for each vendor
      const orderPromises = Object.entries(itemsByVendor).map(async ([vendorId, vendorItems]) => {
        const vendorTotal = vendorItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        return createOrder({
          customerId: user?.id || null,
          customerName: form.name,
          items: vendorItems,
          total: vendorTotal,
          status: 'pending',
          date: new Date().toISOString(),
          deliveryAddress: fullAddress,
          deliveryPhone: form.phone,
          vendorId: vendorId === 'no-vendor' ? null : vendorId,
        });
      });

      const results = await Promise.all(orderPromises);
      
      // Check if any order failed
      const failedOrder = results.find(result => result.error);
      if (failedOrder) {
        addToast(failedOrder.error || 'Failed to place order', 'error');
        setIsPlacingOrder(false);
        return;
      }

      // Update stock for each product
      await updateProductStocks();

      clearCart();
      
      // Navigate to confirmation with all order IDs
      const orderIds = results.map(r => r.data?.id).filter(Boolean);
      navigate('/customer/confirmation', { 
        state: { 
          orderIds,
          items, 
          total: totalPrice 
        } 
      });
    } catch (err) {
      addToast('Failed to place order', 'error');
      setIsPlacingOrder(false);
    }
  };

  const updateProductStocks = async () => {
    const { supabase } = await import('@/lib/supabase');
    
    for (const item of items) {
      const newStock = item.product.stock - item.quantity;
      await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', item.product.id);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar searchQuery="" onSearchChange={() => {}} />
        <div className="max-w-[960px] mx-auto px-4 py-20 text-center">
          <p className="text-5xl mb-4">{'\u{1F6D2}'}</p>
          <h3 className="text-xl font-bold text-[#111318]" style={{ fontFamily: 'Syne, sans-serif' }}>
            Your cart is empty
          </h3>
          <button
            onClick={() => navigate('/customer/home')}
            className="text-[#E8321C] font-semibold mt-3 hover:underline inline-flex items-center gap-1"
          >
            Continue Shopping <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar searchQuery="" onSearchChange={() => {}} />

      <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-[28px] font-bold text-[#111318]" style={{ fontFamily: 'Syne, sans-serif' }}>
          Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Left - Delivery Form */}
          <div className="flex-1">
            <div className="bg-white border border-[#E4E6ED] rounded-2xl p-8">
              <h3 className="text-base font-bold text-[#111318] mb-5" style={{ fontFamily: 'Syne, sans-serif' }}>
                Delivery Details
              </h3>

              <div className="space-y-4">
                <input
                  type="text" placeholder="Full Name"
                  value={form.name} onChange={e => handleChange('name', e.target.value)}
                  className="w-full bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-3 text-sm placeholder-[#B0B7C3] focus:outline-none focus:border-[#E8321C] focus:ring-2 focus:ring-[#E8321C] transition-all"
                  style={{ fontFamily: 'Inter, sans-serif' }} required
                />
                <input
                  type="tel" placeholder="Phone"
                  value={form.phone} onChange={e => handleChange('phone', e.target.value)}
                  className="w-full bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-3 text-sm placeholder-[#B0B7C3] focus:outline-none focus:border-[#E8321C] focus:ring-2 focus:ring-[#E8321C] transition-all"
                  style={{ fontFamily: 'Inter, sans-serif' }} required
                />
                <textarea
                  placeholder="Street Address"
                  rows={3}
                  value={form.address} onChange={e => handleChange('address', e.target.value)}
                  className="w-full bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-3 text-sm placeholder-[#B0B7C3] focus:outline-none focus:border-[#E8321C] focus:ring-2 focus:ring-[#E8321C] transition-all resize-none"
                  style={{ fontFamily: 'Inter, sans-serif' }} required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text" placeholder="City"
                    value={form.city} onChange={e => handleChange('city', e.target.value)}
                    className="w-full bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-3 text-sm placeholder-[#B0B7C3] focus:outline-none focus:border-[#E8321C] focus:ring-2 focus:ring-[#E8321C] transition-all"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  <input
                    type="text" placeholder="Postal Code"
                    value={form.postalCode} onChange={e => handleChange('postalCode', e.target.value)}
                    className="w-full bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-3 text-sm placeholder-[#B0B7C3] focus:outline-none focus:border-[#E8321C] focus:ring-2 focus:ring-[#E8321C] transition-all"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
              </div>

              {/* Payment */}
              <h3 className="text-base font-bold text-[#111318] mt-8 mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
                Payment Method
              </h3>
              <div className="border-2 border-[#E8321C] bg-[#FFF0EE] rounded-xl p-4 flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E8321C] flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111318]">Cash on Delivery</p>
                  <p className="text-xs text-[#6B7280]">Pay when you receive</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className="lg:w-[360px] shrink-0">
            <div
              className="bg-white border border-[#E4E6ED] rounded-2xl p-6 sticky top-24"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              <h3 className="text-lg font-bold text-[#111318] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
                Order Summary
              </h3>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-[#6B7280] truncate flex-1">
                      {item.quantity}× {item.product.name}
                    </span>
                    <span className="font-mono text-[#111318] ml-2">
                      ৳{item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E4E6ED] my-4" />

              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#6B7280]">Subtotal</span>
                <span className="font-mono">৳{totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-[#6B7280]">Delivery</span>
                <span className="font-mono text-[#16A34A]">Free</span>
              </div>

              <div className="flex justify-between">
                <span className="text-base font-bold text-[#111318]">Total</span>
                <span className="text-xl font-bold text-[#E8321C]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  ৳{totalPrice}
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full mt-5 bg-[#E8321C] text-white py-3.5 rounded-lg font-bold hover:bg-[#C5290F] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
