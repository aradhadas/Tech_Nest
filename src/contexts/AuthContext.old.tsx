import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, UserRole } from '@/types';
import { demoUsers } from '@/data';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  register: (name: string, email: string, phone: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, _password: string, role: UserRole): boolean => {
    const found = demoUsers.find(u => u.email === email && u.role === role);
    if (found) {
      if (found.role === 'vendor' && found.approvalStatus === 'pending') {
        setUser(found);
        return true;
      }
      setUser(found);
      return true;
    }
    // Allow login with any password for demo
    const fallback = demoUsers.find(u => u.email === email);
    if (fallback && fallback.role === role) {
      setUser(fallback);
      return true;
    }
    return false;
  }, []);

  const register = useCallback((name: string, email: string, phone: string, _password: string, role: UserRole): boolean => {
    const existing = demoUsers.find(u => u.email === email);
    if (existing) return false;
    
    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      phone,
      role,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'active',
      approvalStatus: role === 'vendor' ? 'pending' : 'approved',
      storeName: role === 'vendor' ? name + ' Store' : undefined,
    };
    setUser(newUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
