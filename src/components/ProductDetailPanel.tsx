import { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import type { Product } from '@/types';
import { categories } from '@/data';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import StatusChip from './StatusChip';

interface ProductDetailPanelProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailPanel({ product, onClose }: ProductDetailPanelProps) {
  const { addToCart, items } = useCart();
  const { addToast } = useToast();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const category = categories.find(c => c.id === product.category);
  const specEntries = Object.entries(product.specs);
  const stockStatus = product.stock > 5 ? 'active' : 'inactive';

  // Check how many of this product are already in cart
  const cartItem = items.find(item => item.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const remainingStock = product.stock - quantityInCart;
  const maxQuantity = Math.max(0, remainingStock);

  const handleAdd = () => {
    if (quantity > remainingStock) {
      addToast(`Only ${remainingStock} units available (${quantityInCart} already in cart)`, 'error');
      return;
    }
    addToCart(product, quantity);
    addToast(`Added ${quantity} × ${product.name} to cart`, 'success');
    setQuantity(1);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-[99]"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-white z-[100] overflow-y-auto"
        style={{
          boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
          animation: 'slideInRight 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        <div className="p-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-lg bg-[#E8321C] text-white hover:bg-[#C5290F] transition-colors z-50 shadow-md"
          >
            <X size={18} />
          </button>

          {/* Icon Box */}
          <div className="relative w-[120px] h-[120px] bg-[#FFF0EE] rounded-2xl flex items-center justify-center mt-4">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <span className="text-5xl">{category?.icon}</span>
            )}
            {/* Pixel decorations */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-[#E8321C] rounded-sm rotate-12" />
            <div className="absolute -bottom-1 -left-3 w-2.5 h-2.5 border-2 border-[#E8321C] rounded-sm -rotate-12" />
            <div className="absolute top-1/2 -right-4 w-2 h-2 bg-[#E8321C] rounded-sm rotate-45" />
          </div>

          {/* Name */}
          <h2
            className="text-[22px] font-bold text-[#111318] mt-5"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            {product.name}
          </h2>

          {/* Chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="bg-[#F7F8FA] rounded-full px-3 py-1 text-xs text-[#6B7280]">
              {product.brand}
            </span>
            <span className="bg-[#F7F8FA] rounded-full px-3 py-1 text-xs text-[#6B7280]">
              {category?.icon} {category?.name}
            </span>
            <StatusChip status={stockStatus as 'active' | 'inactive'} />
          </div>

          {/* Price & Stock */}
          <div className="flex items-center justify-between mt-4">
            <p
              className="text-[28px] font-bold text-[#E8321C]"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              ৳{product.price}
            </p>
            <div className="text-right">
              <p className="text-sm text-[#6B7280]">
                <span className="font-semibold">{product.stock}</span> units in stock
              </p>
              {quantityInCart > 0 && (
                <p className="text-xs text-[#E8321C]">
                  {quantityInCart} in cart
                </p>
              )}
            </div>
          </div>

          {/* Specs Table */}
          <div className="mt-5">
            <table className="w-full">
              <tbody>
                {specEntries.map(([key, value], i) => (
                  <tr
                    key={key}
                    className="border-b border-[#E4E6ED] last:border-0"
                    style={{ backgroundColor: i % 2 === 0 ? '#F7F8FA' : 'white' }}
                  >
                    <td
                      className="py-2.5 px-3 text-xs text-[#6B7280] font-mono w-[40%]"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      {key}
                    </td>
                    <td className="py-2.5 px-3 text-[13px] text-[#111318]">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-[#6B7280] mt-4 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-3 mt-6">
            <span className="text-sm text-[#6B7280]">Quantity:</span>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 border border-[#E4E6ED] rounded-lg flex items-center justify-center text-[#6B7280] hover:border-[#E8321C] hover:text-[#E8321C] transition-colors"
            >
              <Minus size={14} />
            </button>
            <span
              className="text-lg font-bold w-10 text-center"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              disabled={quantity >= maxQuantity}
              className="w-8 h-8 border border-[#E4E6ED] rounded-lg flex items-center justify-center text-[#6B7280] hover:border-[#E8321C] hover:text-[#E8321C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Stock Warning */}
          {remainingStock === 0 ? (
            <p className="text-xs text-[#E8321C] mt-2">
              All available units are already in your cart
            </p>
          ) : quantity >= maxQuantity && maxQuantity > 0 ? (
            <p className="text-xs text-[#E8321C] mt-2">
              Only {remainingStock} more units available ({quantityInCart} already in cart)
            </p>
          ) : null}

          {/* Add to Cart */}
          <button
            onClick={handleAdd}
            disabled={remainingStock === 0}
            className="w-full mt-6 bg-[#E8321C] text-white py-3.5 rounded-lg font-bold text-base hover:bg-[#C5290F] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            {remainingStock === 0 ? 'All Units in Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </>
  );
}
