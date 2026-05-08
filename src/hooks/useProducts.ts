import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

export function useProducts(filterActive: boolean = true) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      let query = supabase
        .from('products')
        .select('*');

      // Only filter by active status if requested
      if (filterActive) {
        query = query.eq('status', 'active');
      }

      const { data, error } = await query.order('name', { ascending: true });

      if (error) throw error;

      // Map image_url to image for compatibility
      const mappedProducts = (data || []).map(product => ({
        ...product,
        image: product.image_url,
      }));

      setProducts(mappedProducts);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }

  async function addProduct(product: Omit<Product, 'id'>) {
    try {
      // Generate product ID
      const productId = 'p' + String(Date.now()).slice(-8);

      // Remove 'image' field and use 'image_url' instead
      const { image, ...rest } = product as any;

      const { data, error } = await supabase
        .from('products')
        .insert([{
          id: productId,
          ...rest,
          image_url: image || undefined,
        }])
        .select()
        .single();

      if (error) throw error;

      // Map image_url to image
      const mappedProduct = { ...data, image: data.image_url };
      setProducts(prev => [mappedProduct, ...prev]);
      return { data: mappedProduct, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to add product' };
    }
  }

  async function updateProduct(id: string, updates: Partial<Product>) {
    try {
      // Remove 'image' field and use 'image_url' instead
      const { image, ...rest } = updates as any;
      const dbUpdates = {
        ...rest,
        image_url: image || rest.image_url,
      };

      const { data, error } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Map image_url to image
      const mappedProduct = { ...data, image: data.image_url };
      setProducts(prev => prev.map(p => (p.id === id ? mappedProduct : p)));
      return { data: mappedProduct, error: null };
    } catch (err) {
      console.error('Update error:', err);
      return { data: null, error: err instanceof Error ? err.message : 'Failed to update product' };
    }
  }

  async function deleteProduct(id: string) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to delete product' };
    }
  }

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
