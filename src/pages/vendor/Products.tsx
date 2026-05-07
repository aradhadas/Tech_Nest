import { useState } from 'react';
import { Plus, Pencil, X } from 'lucide-react';
import { products as allProducts, categories } from '@/data';
import Sidebar from '@/components/Sidebar';
import StatusChip from '@/components/StatusChip';
import { useToast } from '@/contexts/ToastContext';
import type { Product, ProductSpecs } from '@/types';

export default function VendorProducts() {
  const { addToast } = useToast();
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [showPanel, setShowPanel] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>({
    name: '', category: 'cat-001', brand: 'TechNest Labs', price: 0, stock: 0, status: 'active', specs: {}, description: ''
  });
  const [specs, setSpecs] = useState<[string, string][]>([['', '']]);

  const openAdd = () => {
    setEditingProduct(null);
    setForm({ name: '', category: 'cat-001', brand: 'TechNest Labs', price: 0, stock: 0, status: 'active', specs: {}, description: '' });
    setSpecs([['', '']]);
    setShowPanel(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({ ...product });
    setSpecs(Object.entries(product.specs));
    setShowPanel(true);
  };

  const saveProduct = () => {
    const specsObj: ProductSpecs = {};
    specs.forEach(([k, v]) => { if (k && v) specsObj[k] = v; });

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...form, specs: specsObj } as Product : p));
      addToast('Product updated', 'success');
    } else {
      const newProduct: Product = {
        id: `p${Date.now()}`,
        name: form.name || 'New Product',
        price: form.price || 0,
        stock: form.stock || 0,
        category: form.category || 'cat-001',
        brand: form.brand || 'TechNest Labs',
        specs: specsObj,
        description: form.description || '',
        status: form.status as 'active' | 'inactive' || 'active',
      };
      setProducts(prev => [newProduct, ...prev]);
      addToast('Product added', 'success');
    }
    setShowPanel(false);
  };

  const toggleStatus = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' as 'active' | 'inactive' } : p));
    addToast('Status updated', 'success');
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Sidebar role="vendor" />

      <main className="lg:ml-[240px] p-6 pt-20 lg:p-8 lg:pt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[22px] font-bold text-[#111318]" style={{ fontFamily: 'Syne, sans-serif' }}>
            My Products
          </h1>
          <button
            onClick={openAdd}
            className="bg-[#E8321C] text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#C5290F] transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-xl border border-[#E4E6ED] overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#F0F1F5] text-xs font-mono font-bold text-[#6B7280]">
            <div className="col-span-3">Product Name</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-1">Stock</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Actions</div>
          </div>
          {products.map(product => (
            <div
              key={product.id}
              className={`grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#E4E6ED] last:border-0 items-center ${
                product.status === 'inactive' ? 'opacity-60' : ''
              }`}
            >
              <div className="col-span-3 text-sm font-bold text-[#111318] truncate">{product.name}</div>
              <div className="col-span-2 text-sm text-[#6B7280]">
                {categories.find(c => c.id === product.category)?.icon}{' '}
                {categories.find(c => c.id === product.category)?.name}
              </div>
              <div className="col-span-2 text-sm font-mono font-bold text-[#E8321C]">৳{product.price}</div>
              <div className="col-span-1 text-sm font-mono">{product.stock}</div>
              <div className="col-span-2"><StatusChip status={product.status} /></div>
              <div className="col-span-2 flex items-center gap-2">
                <button
                  onClick={() => openEdit(product)}
                  className="p-1.5 text-[#6B7280] hover:text-[#E8321C] transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => toggleStatus(product.id)}
                  className="text-xs px-2 py-1 rounded border border-[#E4E6ED] hover:border-[#E8321C] hover:text-[#E8321C] transition-colors"
                >
                  {product.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Card Layout */}
        <div className="lg:hidden space-y-3">
          {products.map(product => (
            <div
              key={product.id}
              className={`bg-white rounded-xl border border-[#E4E6ED] p-4 ${
                product.status === 'inactive' ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-[#111318]">{product.name}</h3>
                  <p className="text-xs text-[#6B7280]">
                    {categories.find(c => c.id === product.category)?.icon} {categories.find(c => c.id === product.category)?.name}
                  </p>
                </div>
                <StatusChip status={product.status} />
              </div>
              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Price:</span>
                  <span className="font-mono font-bold text-[#E8321C]">৳{product.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Stock:</span>
                  <span className="font-mono">{product.stock}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(product)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 px-3 text-xs border border-[#E4E6ED] rounded-lg text-[#6B7280] hover:border-[#E8321C] hover:text-[#E8321C] transition-colors"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => toggleStatus(product.id)}
                  className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#E4E6ED] hover:border-[#E8321C] hover:text-[#E8321C] transition-colors"
                >
                  {product.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add/Edit Panel */}
      {showPanel && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[99]" onClick={() => setShowPanel(false)} />
          <div
            className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-white z-[100] overflow-y-auto"
            style={{ animation: 'slideInRight 300ms cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#111318]" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {editingProduct ? 'Edit Product' : 'Add Product'}
                </h2>
                <button onClick={() => setShowPanel(false)} className="p-2 border border-[#E4E6ED] rounded-lg hover:border-[#E8321C]">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#6B7280] mb-1 block">Product Name</label>
                  <input
                    type="text" value={form.name || ''}
                    onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8321C]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#6B7280] mb-1 block">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8321C]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#6B7280] mb-1 block">Price (৳)</label>
                    <input
                      type="number" value={form.price || 0}
                      onChange={e => setForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8321C]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#6B7280] mb-1 block">Stock</label>
                    <input
                      type="number" value={form.stock || 0}
                      onChange={e => setForm(prev => ({ ...prev, stock: Number(e.target.value) }))}
                      className="w-full bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8321C]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#6B7280] mb-1 block">Description</label>
                  <textarea
                    rows={3} value={form.description || ''}
                    onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8321C] resize-none"
                  />
                </div>

                {/* Specs */}
                <div>
                  <label className="text-xs text-[#6B7280] mb-2 block">Specifications</label>
                  {specs.map((spec, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input
                        type="text" placeholder="Key" value={spec[0]}
                        onChange={e => {
                          const newSpecs = [...specs];
                          newSpecs[i][0] = e.target.value;
                          setSpecs(newSpecs);
                        }}
                        className="flex-1 bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#E8321C]"
                      />
                      <input
                        type="text" placeholder="Value" value={spec[1]}
                        onChange={e => {
                          const newSpecs = [...specs];
                          newSpecs[i][1] = e.target.value;
                          setSpecs(newSpecs);
                        }}
                        className="flex-1 bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E8321C]"
                      />
                      {specs.length > 1 && (
                        <button
                          onClick={() => setSpecs(specs.filter((_, j) => j !== i))}
                          className="text-[#B0B7C3] hover:text-[#E8321C]"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setSpecs([...specs, ['', '']])}
                    className="text-xs text-[#E8321C] font-medium hover:underline"
                  >
                    + Add spec
                  </button>
                </div>

                {/* Status toggle */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#6B7280]">Status:</span>
                  <button
                    onClick={() => setForm(prev => ({ ...prev, status: prev.status === 'active' ? 'inactive' : 'active' }))}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      form.status === 'active'
                        ? 'bg-[#DCFCE7] text-[#14532D]'
                        : 'bg-[#F3F4F6] text-[#4B5563]'
                    }`}
                  >
                    {form.status === 'active' ? 'Active' : 'Inactive'}
                  </button>
                </div>

                <button
                  onClick={saveProduct}
                  className="w-full bg-[#E8321C] text-white py-3 rounded-lg font-bold hover:bg-[#C5290F] transition-colors mt-4"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  Save Product
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
