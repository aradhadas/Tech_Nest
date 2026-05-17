import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';

export function useOrders(customerId?: string, vendorId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order change detected:', payload);
          // Refetch orders when any change occurs
          fetchOrders();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [customerId, vendorId]);

  async function fetchOrders() {
    try {
      setLoading(true);
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (customerId) {
        query = query.eq('customer_id', customerId);
      }

      if (vendorId) {
        query = query.eq('vendor_id', vendorId);
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log('Fetched orders from Supabase:', data);

      // Map snake_case to camelCase for frontend compatibility
      const mappedOrders = (data || []).map(order => ({
        id: order.id,
        customerId: order.customer_id,
        customerName: order.customer_name,
        items: order.items,
        total: order.total,
        status: order.status,
        date: order.created_at,
        deliveryAddress: order.delivery_address,
        deliveryPhone: order.delivery_phone,
        vendorId: order.vendor_id,
      }));

      console.log('Mapped orders:', mappedOrders);

      setOrders(mappedOrders);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }

  async function createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
    try {
      // Generate order ID
      const orderId = 'TN-' + String(Date.now()).slice(-6);

      console.log('Creating order with data:', {
        id: orderId,
        customer_id: order.customerId,
        customer_name: order.customerName,
        items: order.items,
        total: order.total,
        status: order.status,
        delivery_address: order.deliveryAddress,
        delivery_phone: order.deliveryPhone,
        vendor_id: order.vendorId,
      });

      const { data, error } = await supabase
        .from('orders')
        .insert([{
          id: orderId,
          customer_id: order.customerId || null,
          customer_name: order.customerName,
          items: JSON.parse(JSON.stringify(order.items)), // Deep clone to remove any circular refs
          total: order.total,
          status: order.status,
          delivery_address: order.deliveryAddress,
          delivery_phone: order.deliveryPhone,
          vendor_id: order.vendorId || null,
        }])
        .select()
        .single();

      if (error) throw error;

      console.log('Order created successfully:', data);

      // Map snake_case to camelCase
      const mappedOrder = {
        id: data.id,
        customerId: data.customer_id,
        customerName: data.customer_name,
        items: data.items,
        total: data.total,
        status: data.status,
        date: data.created_at,
        deliveryAddress: data.delivery_address,
        deliveryPhone: data.delivery_phone,
        vendorId: data.vendor_id,
      };

      setOrders(prev => [mappedOrder, ...prev]);
      return { data: mappedOrder, error: null };
    } catch (err) {
      console.error('Error creating order:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Failed to create order' 
      };
    }
  }

  async function updateOrderStatus(orderId: string, status: Order['status']) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      // Map snake_case to camelCase
      const mappedOrder = {
        id: data.id,
        customerId: data.customer_id,
        customerName: data.customer_name,
        items: data.items,
        total: data.total,
        status: data.status,
        date: data.created_at,
        deliveryAddress: data.delivery_address,
        deliveryPhone: data.delivery_phone,
        vendorId: data.vendor_id,
      };

      setOrders(prev => prev.map(o => (o.id === orderId ? mappedOrder : o)));
      return { data: mappedOrder, error: null };
    } catch (err) {
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Failed to update order' 
      };
    }
  }

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    createOrder,
    updateOrderStatus,
  };
}
