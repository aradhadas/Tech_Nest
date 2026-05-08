/**
 * Supabase-powered Authentication Context
 * 
 * This file will REPLACE src/contexts/AuthContext.tsx after Supabase setup
 * 
 * Features:
 * - Real user authentication with Supabase Auth
 * - User profile management in public.users table
 * - Role-based access control (customer, vendor, admin)
 * - Vendor approval workflow
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password: string, role: UserRole, storeInfo?: { storeName: string; storeDescription: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from public.users table
  const fetchUserProfile = useCallback(async (authUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) throw error;

      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role as UserRole,
          address: data.address,
          joinedDate: data.joined_date,
          status: data.status,
          approvalStatus: data.approval_status,
          storeName: data.store_name,
          storeDescription: data.store_description,
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  const register = useCallback(async (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: UserRole,
    storeInfo?: { storeName: string; storeDescription: string }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      // 2. Create user profile
      const { error: profileError } = await supabase.from('users').insert([
        {
          id: authData.user.id,
          name,
          email,
          phone,
          role,
          status: 'active',
          approval_status: role === 'vendor' ? 'pending' : 'approved',
          store_name: storeInfo?.storeName,
          store_description: storeInfo?.storeDescription,
        },
      ]);

      if (profileError) throw profileError;

      // 3. Fetch and set user profile
      await fetchUserProfile(authData.user);

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  }, [fetchUserProfile]);

  const login = useCallback(async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Login failed');

      await fetchUserProfile(data.user);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }, [fetchUserProfile]);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const updateUser = useCallback(async (
    updates: Partial<User>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: updates.name,
          phone: updates.phone,
          address: updates.address,
          store_name: updates.storeName,
          store_description: updates.storeDescription,
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser(prev => (prev ? { ...prev, ...updates } : null));

      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Update failed',
      };
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
