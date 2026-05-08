import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { categories as allCategories, products } from '@/data';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/contexts/ToastContext';
import type { Category } from '@/types';

export default function AdminCategories() {
  const { addToast } = useToast();
  const [categories, setCategories] = useState<Category[]>(allCategories);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', icon: '', color: '#E8321C', description: '' });

  const getProductCount = (catId: string) => products.filter(p => p.category === catId).length;

  const handleAdd = () => {
    if (!form.name || !form.icon) return;
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: form.name,
      icon: form.icon,
      color: form.color,
      description: form.description,
    };
    setCategories(prev => [...prev, newCat]);
    setForm({ name: '', icon: '', color: '#E8321C', description: '' });
    setShowForm(false);
    addToast('Category added', 'success');
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, icon: cat.icon, color: cat.color, description: cat.description || '' });
  };

  const handleSaveEdit = () => {
    setCategories(prev => prev.map(c =>
      c.id === editingId ? { ...c, ...form } : c
    ));
    setEditingId(null);
    addToast('Category updated', 'success');
  };

  const handleDelete = (catId: string) => {
    const count = getProductCount(catId);
    if (count > 0) {
      addToast(`Cannot delete: ${count} products exist`, 'error');
      return;
    }
    setCategories(prev => prev.filter(c => c.id !== catId));
    addToast('Category deleted', 'info');
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Sidebar role="admin" />

      <main className="lg:ml-[240px] p-6 pt-20 lg:p-8 lg:pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center items-start justify-between gap-4 mb-6">
          <h1 className="text-[22px] font-bold text-[#111318]" style={{ fontFamily: 'Syne, sans-serif' }}>
            Categories
          </h1>
          <button
            onClick={() => { setShowForm(!showForm); setEditingId(null); }}
            className="w-full sm:w-auto bg-[#E8321C] text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#C5290F] transition-colors flex items-center justify-center sm:justify-start gap-2"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-[#E4E6ED] p-6 mb-6" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 className="text-sm font-bold text-[#111318] mb-4">New Category</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <input
                type="text" placeholder="Name" value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8321C]"
              />
              <input
                type="text" placeholder="Icon (emoji)" value={form.icon}
                onChange={e => setForm(prev => ({ ...prev, icon: e.target.value }))}
                className="bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8321C]"
              />
              <input
                type="color" value={form.color}
                onChange={e => setForm(prev => ({ ...prev, color: e.target.value }))}
                className="bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-2 py-2 text-sm h-[42px]"
              />
              <input
                type="text" placeholder="Description" value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                className="bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8321C]"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleAdd} className="bg-[#E8321C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#C5290F]">
                Save
              </button>
              <button onClick={() => setShowForm(false)} className="border border-[#E4E6ED] text-[#6B7280] px-4 py-2 rounded-lg text-sm hover:border-[#E8321C]">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {categories.map(cat => {
            const productCount = getProductCount(cat.id);
            const isEditing = editingId === cat.id;

            return (
              <div
                key={cat.id}
                className="bg-white rounded-xl p-6 border border-[#E4E6ED]"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text" value={form.name}
                        onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E8321C]"
                      />
                      <input
                        type="text" value={form.icon}
                        onChange={e => setForm(prev => ({ ...prev, icon: e.target.value }))}
                        className="bg-[#F7F8FA] border border-[#E4E6ED] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E8321C]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleSaveEdit} className="p-1.5 text-[#16A34A] hover:bg-[#DCFCE7] rounded transition-colors">
                        <Check size={16} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 text-[#E8321C] hover:bg-[#FEE2E2] rounded transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{cat.icon}</span>
                        <div>
                          <h3 className="text-lg font-bold text-[#111318]" style={{ fontFamily: 'Syne, sans-serif' }}>
                            {cat.name}
                          </h3>
                          <p className="text-xs text-[#6B7280] mt-0.5">{cat.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-1.5 text-[#6B7280] hover:text-[#E8321C] transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 text-[#6B7280] hover:text-[#E8321C] transition-colors"
                          title={productCount > 0 ? `${productCount} products exist` : ''}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: cat.color + '15', color: cat.color }}
                      >
                        {productCount} products
                      </span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
