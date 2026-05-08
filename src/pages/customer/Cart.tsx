import { useNavigate } from 'react-router-dom';
import { Minus, Plus, X, ShoppingCart, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-white">
      <Navbar searchQuery="" onSearchChange={() => {}} />

      <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/customer/home')}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#E8321C] mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Continue Shopping</span>
        </button>

        <h1
          className="text-[28px] font-bold text-[#111318]"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart size={64} className="mx-auto text-[#B0B7C3] mb-4" />
            <h3
              className="text-xl font-bold text-[#111318]"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Your cart is empty
            </h3>
            <button
              onClick={() => navigate('/customer/home')}
              className="text-[#E8321C] font-semibold mt-3 hover:underline inline-flex items-center gap-1"
            >
              Start exploring <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 mt-8">
            {/* Cart Items */}
            <div className="flex-1">
              {items.map(item => {
                const category = item.product.category === 'cat-001' ? '💡' :
                  item.product.category === 'cat-002' ? '🔋' :
                  item.product.category === 'cat-003' ? '🔊' : '🔐';
                const specKeys = Object.keys(item.product.specs).slice(0, 2);

                return (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-4 py-5 border-b border-[#E4E6ED]"
                  >
                    {/* Icon */}
                    <div className="w-12 h-12 bg-[#FFF0EE] rounded-xl flex items-center justify-center shrink-0">
                      {item.product.image ? (
                        <img src={item.product.image} alt="" className="w-10 h-10 object-cover rounded-lg" />
                      ) : (
                        <span className="text-xl">{category}</span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4
                        className="text-[15px] font-bold text-[#111318] truncate"
                        style={{ fontFamily: 'Syne, sans-serif' }}
                      >
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        {specKeys.map(k => item.product.specs[k]).join(' · ')}
                      </p>
                    </div>

                    {/* Qty */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 border border-[#E4E6ED] rounded-lg flex items-center justify-center text-[#6B7280] hover:border-[#E8321C]"
                      >
                        <Minus size={12} />
                      </button>
                      <span
                        className="text-sm font-bold w-6 text-center"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 border border-[#E4E6ED] rounded-lg flex items-center justify-center text-[#6B7280] hover:border-[#E8321C]"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right min-w-[80px]">
                      <p className="text-sm font-mono text-[#6B7280]">
                        ৳{item.product.price}
                      </p>
                      <p
                        className="text-base font-bold text-[#111318]"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        ৳{item.product.price * item.quantity}
                      </p>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[#B0B7C3] hover:text-[#E8321C] transition-colors p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:w-[320px] shrink-0">
              <div
                className="bg-white border border-[#E4E6ED] rounded-2xl p-6 sticky top-24"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                <h3
                  className="text-lg font-bold text-[#111318]"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  Order Summary
                </h3>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B7280]">Subtotal</span>
                    <span className="font-mono text-[#111318]">৳{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B7280]">Delivery</span>
                    <span className="font-mono text-[#16A34A]">Free</span>
                  </div>
                </div>

                <div className="border-t border-[#E4E6ED] my-4" />

                <div className="flex justify-between">
                  <span className="text-base font-bold text-[#111318]">Total</span>
                  <span
                    className="text-xl font-bold text-[#E8321C]"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    ৳{totalPrice}
                  </span>
                </div>

                <button
                  onClick={() => navigate('/customer/checkout')}
                  className="w-full mt-5 bg-[#E8321C] text-white py-3.5 rounded-lg font-bold hover:bg-[#C5290F] transition-colors flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
