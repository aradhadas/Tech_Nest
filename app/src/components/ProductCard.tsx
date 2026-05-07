import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/types';
import { categories } from '@/data';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const category = categories.find(c => c.id === product.category);
  const specEntries = Object.entries(product.specs).slice(0, 2);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    addToast(`Added ${product.name} to cart`, 'success');
  };

  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#E4E6ED] rounded-xl p-5 cursor-pointer transition-all duration-200 hover:border-[#E8321C] hover:-translate-y-0.5 group"
      style={{
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(232,50,28,0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
      }}
    >
      {/* Category color top border */}
      <div
        className="absolute top-0 left-5 right-5 h-[3px] rounded-full"
        style={{ backgroundColor: category?.color || '#E8321C' }}
      />

      {/* Image */}
      <div className="w-full aspect-square bg-[#FFF0EE] rounded-xl flex items-center justify-center mb-3 overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">{category?.icon}</span>
        )}
      </div>

      {/* Brand */}
      <p className="text-[11px] font-mono text-[#6B7280]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        {product.brand}
      </p>

      {/* Name */}
      <h3
        className="text-[15px] font-bold text-[#111318] mt-1 line-clamp-2 min-h-[40px]"
        style={{ fontFamily: 'Syne, sans-serif' }}
      >
        {product.name}
      </h3>

      {/* Spec Pills */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {specEntries.map(([key, value]) => (
          <span
            key={key}
            className="bg-[#F7F8FA] rounded-md px-2 py-1 text-[11px] text-[#6B7280] font-mono"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {value.length > 15 ? value.slice(0, 15) + '...' : value}
          </span>
        ))}
      </div>

      {/* Price Row */}
      <div className="flex items-center justify-between mt-3">
        <div>
          <span
            className="text-[16px] font-bold text-[#E8321C]"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            ৳{product.price}
          </span>
          <p className="text-[11px] text-[#6B7280] mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
            {product.stock} units in stock
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="w-9 h-9 rounded-full bg-[#E8321C] text-white flex items-center justify-center hover:bg-[#C5290F] transition-colors"
        >
          <ShoppingCart size={15} />
        </button>
      </div>
    </div>
  );
}
