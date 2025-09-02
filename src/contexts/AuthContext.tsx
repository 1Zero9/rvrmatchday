/**
 * Auth Context - User Authentication and Authorization
 * Provides authentication state management across the application
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { SupabaseTrackerUser, getCurrentUser, signOut as supabaseSignOut } from '../lib/supabase-auth';

interface AuthContextType {
  user: SupabaseTrackerUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  canAccessTeam: (teamId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<SupabaseTrackerUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadUser();
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await loadUser();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await loadUser();
  };

  const signOut = async () => {
    try {
      await supabaseSignOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.is_active) return false;
    
    // Admin has all permissions
    if (user.role === 'admin' || user.permissions.includes('*')) {
      return true;
    }
    
    return user.permissions.includes(permission);
  };

  const canAccessTeam = (teamId: string): boolean => {
    if (!user || !user.is_active) return false;
    
    // Admin or users with all teams access
    if (user.role === 'admin' || user.teams.includes('*')) {
      return true;
    }
    
    return user.teams.includes(teamId);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    signOut,
    refreshUser,
    hasPermission,
    canAccessTeam
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}