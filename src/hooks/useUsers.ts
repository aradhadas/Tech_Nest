import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('users-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users'
        },
        (payload) => {
          console.log('User change detected:', payload);
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('joined_date', { ascending: false });

      if (error) throw error;

      // Map snake_case to camelCase
      const mappedUsers = (data || []).map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        joinedDate: user.joined_date,
        status: user.status,
        approvalStatus: user.approval_status,
        storeName: user.store_name,
        storeDescription: user.store_description,
      }));

      setUsers(mappedUsers);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }

  async function updateUserStatus(userId: string, status: 'active' | 'suspended') {
    try {
      const { error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers();
      return { success: true, error: null };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update user status'
      };
    }
  }

  async function updateApprovalStatus(
    userId: string,
    approvalStatus: 'pending' | 'approved' | 'rejected'
  ) {
    try {
      const { error } = await supabase
        .from('users')
        .update({ approval_status: approvalStatus })
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers();
      return { success: true, error: null };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update approval status'
      };
    }
  }

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    updateUserStatus,
    updateApprovalStatus,
  };
}
