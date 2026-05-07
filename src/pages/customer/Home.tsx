import { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { products, categories } from '@/data';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import ProductDetailPanel from '@/components/ProductDetailPanel';
import type { Product } from '@/types';

export default function CustomerHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        Object.values(p.specs).some(s => s.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'name-asc': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': result.sort((a, b) => b.name.localeCompare(a.name)); break;
    }

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative overflow-hidden"
        style={{
          backgroundColor: '#111318',
          padding: 'clamp(60px, 8vw, 100px) 0',
        }}
      >
        {/* Animated background - pixel pulse effect */}
        <div className="absolute inset-0 overflow-hidden">
          <PixelPulseEffect />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 max-w-[55%]">
            {/* Pixel accents near heading */}
            <div className="absolute top-[20%] left-[8%] w-3.5 h-3.5 bg-[#E8321C] rounded-sm rotate-12 opacity-70" />
            <div className="absolute top-[35%] left-[5%] w-2.5 h-2.5 border-2 border-[#E8321C] rounded-sm -rotate-12 opacity-60" />
            <div className="absolute top-[50%] left-[10%] w-3 h-3 bg-[#F59E0B] rounded-sm rotate-45 opacity-50" />

            <h1
              className="font-extrabold text-white leading-tight"
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                textShadow: '0 2px 12px rgba(0,0,0,0.6)',
              }}
            >
              Build. Learn. <span className="text-[#E8321C]">Create.</span>
            </h1>
            <p
              className="mt-4 text-base lg:text-lg max-w-md"
              style={{ color: 'rgba(247,248,250,0.75)', fontFamily: 'Inter, sans-serif' }}
            >
              40+ electronics project kits for students & makers
            </p>
            <button
              onClick={() => {
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-7 inline-flex items-center gap-2 bg-[#E8321C] text-white px-7 py-3.5 rounded-lg font-bold text-base hover:bg-[#C5290F] transition-colors"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Explore Kits <ArrowRight size={18} />
            </button>
          </div>

          {/* Right decorative space - pulse effect fills this */}
          <div className="hidden lg:block flex-1 h-[300px]" />
        </div>
      </section>

      {/* Category Filter Row */}
      <section className="sticky top-16 z-40 bg-white border-b border-[#E4E6ED]">
        <div className="max-w-[1440px] mx-auto py-4">
          <div className="flex gap-2.5 flex-nowrap items-center overflow-x-auto px-4 sm:px-6 lg:px-12 pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style>{`
              .flex-nowrap::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <button
              onClick={() => setActiveCategory('all')}
              className={`whitespace-nowrap flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                activeCategory === 'all'
                  ? 'bg-[#E8321C] text-white border-[#E8321C]'
                  : 'bg-white text-[#111318] border-[#E4E6ED] hover:bg-[#FFF0EE] hover:border-[#E8321C]'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-[#E8321C] text-white border-[#E8321C]'
                    : 'bg-white text-[#111318] border-[#E4E6ED] hover:bg-[#FFF0EE] hover:border-[#E8321C]'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="products" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 pb-16">
        {/* Sort Bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#6B7280]">
            Showing {filteredProducts.length} products
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#6B7280]">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border border-[#E4E6ED] rounded-lg px-3 py-2 text-sm text-[#111318] bg-white focus:outline-none focus:border-[#E8321C]"
            >
              <option value="name-asc">Name: A-Z</option>
              <option value="name-desc">Name: Z-A</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">{'\u{1F50D}'}</p>
            <h3 className="text-xl font-bold text-[#111318]" style={{ fontFamily: 'Syne, sans-serif' }}>
              No products found
            </h3>
            <p className="text-sm text-[#6B7280] mt-2">Try adjusting your search or filter</p>
          </div>
        )}
      </section>

      {/* Product Detail Panel */}
      {selectedProduct && (
        <ProductDetailPanel
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

/* Animated pixel pulse background for hero */
function PixelPulseEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Array<{
    x: number; y: number; size: number; speed: number;
    angle: number; life: number; maxLife: number;
    hue: number; rotation: number; rotSpeed: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = particlesRef.current;
    let time = 0;

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Spawn new particles
      const spawnCount = 5 + Math.floor(Math.sin(time * 0.05) * 3);
      for (let i = 0; i < spawnCount; i++) {
        const angle = (time * 0.3 + (i / spawnCount) * Math.PI * 2) % (Math.PI * 2);
        const radius = 60 + Math.random() * 120;
        particles.push({
          x: w / 2 + Math.cos(angle) * radius,
          y: h / 2 + Math.sin(angle) * radius,
          size: 8 + Math.random() * 32,
          speed: 0.3 + Math.random() * 0.8,
          angle: angle + Math.PI / 2 + (Math.random() - 0.5) * 0.5,
          life: 0,
          maxLife: 90 + Math.random() * 60,
          hue: 0.02 + Math.random() * 0.07,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.04,
        });
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        if (p.life > p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.rotation += p.rotSpeed;

        const lifeRatio = p.life / p.maxLife;
        let alpha: number;
        if (lifeRatio < 0.1) {
          alpha = lifeRatio / 0.1;
        } else if (lifeRatio > 0.7) {
          alpha = (1 - lifeRatio) / 0.3;
        } else {
          alpha = 1;
        }

        // Brand red to amber color
        const r = Math.round(232 + (217 - 232) * (p.hue - 0.02) / 0.07);
        const g = Math.round(50 + (119 - 50) * (p.hue - 0.02) / 0.07);
        const b = Math.round(28 + (6 - 28) * (p.hue - 0.02) / 0.07);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = alpha * 0.5;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }

      // Center pulse glow
      const pulseSize = 80 + Math.sin(time * 0.08) * 30;
      const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, pulseSize);
      gradient.addColorStop(0, 'rgba(232,50,28,0.15)');
      gradient.addColorStop(0.5, 'rgba(232,50,28,0.05)');
      gradient.addColorStop(1, 'rgba(232,50,28,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      time++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ willChange: 'transform' }}
    />
  );
}
