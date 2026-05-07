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
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const category = categories.find(c => c.id === product.category);
  const specEntries = Object.entries(product.specs);
  const stockStatus = product.stock > 5 ? 'active' : 'inactive';

  const handleAdd = () => {
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
            className="absolute top-4 right-4 w-9 h-9 border border-[#E4E6ED] rounded-lg flex items-center justify-center text-[#6B7280] hover:text-[#E8321C] hover:border-[#E8321C] transition-colors"
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

          {/* Price */}
          <p
            className="text-[28px] font-bold text-[#E8321C] mt-4"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            ৳{product.price}
          </p>

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
          <p className="text-sm text-[#6B7280] mt-4 leading-relaxed">
            Complete DIY kit including PCB, components, and step-by-step instructions. Perfect for learning and prototyping. All components are pre-sorted and labeled for easy assembly.
          </p>

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
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 border border-[#E4E6ED] rounded-lg flex items-center justify-center text-[#6B7280] hover:border-[#E8321C] hover:text-[#E8321C] transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAdd}
            className="w-full mt-6 bg-[#E8321C] text-white py-3.5 rounded-lg font-bold text-base hover:bg-[#C5290F] transition-colors"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}
