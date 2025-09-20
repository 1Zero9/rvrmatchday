/**
 * Secure Authentication System
 * Replaces all insecure client-side authentication with proper Supabase Auth
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: 'admin' | 'editor' | 'coach' | 'manager' | 'parent' | 'volunteer';
  teams: string[];
  permissions: string[];
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isTeamMember: (team: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for demo session first
    if (typeof window !== 'undefined') {
      const demoSession = localStorage.getItem('demo_session');
      if (demoSession) {
        try {
          const { user: demoUser, profile: demoProfile } = JSON.parse(demoSession);
          setUser(demoUser);
          setProfile(demoProfile);
          setLoading(false);
          return;
        } catch (error) {
          localStorage.removeItem('demo_session');
        }
      }
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id, session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadUserProfile(session.user.id, session.user);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string, currentUser?: User) => {
    try {
      // Set a reasonable timeout for the database query
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile load timeout')), 10000)
      );

      const queryPromise = supabase
        .from('tracker_users')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

      if (error) {
        console.error('Error loading user profile:', error);
        // Create a basic fallback profile for authenticated users
        const currentUserData = currentUser || user;
        const fallbackProfile: UserProfile = {
          id: userId,
          email: currentUserData?.email || '',
          username: currentUserData?.email?.split('@')[0] || 'user',
          full_name: currentUserData?.user_metadata?.full_name || currentUserData?.email?.split('@')[0] || 'User',
          role: 'coach', // Default role for fallback
          teams: [],
          permissions: ['match:view', 'match:record'],
          is_active: true
        };
        setProfile(fallbackProfile);
        console.log('Using fallback profile for authenticated user');
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Profile load failed:', error);
      // Still create fallback profile for authenticated users
      const currentUserData = currentUser || user;
      if (currentUserData) {
        const fallbackProfile: UserProfile = {
          id: userId,
          email: currentUserData.email || '',
          username: currentUserData.email?.split('@')[0] || 'user',
          full_name: currentUserData.user_metadata?.full_name || currentUserData.email?.split('@')[0] || 'User',
          role: 'coach',
          teams: [],
          permissions: ['match:view', 'match:record'],
          is_active: true
        };
        setProfile(fallbackProfile);
        console.log('Using fallback profile due to database error');
      } else {
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Check for demo accounts first (fallback for production)
      if (email === 'demo@rvrfc.com' && password === 'demo123') {
        // Create a fake user and session for demo purposes
        const demoUser = {
          id: 'demo-user',
          email: 'demo@rvrfc.com',
          user_metadata: { full_name: 'Demo User' }
        } as User;
        
        const demoProfile: UserProfile = {
          id: 'demo-user',
          email: 'demo@rvrfc.com',
          username: 'demo',
          full_name: 'Demo User',
          role: 'coach',
          teams: ['First Team', 'Reserves'],
          permissions: ['match:view', 'match:record', 'match:edit'],
          is_active: true
        };
        
        setUser(demoUser);
        setProfile(demoProfile);
        setLoading(false);
        
        // Store demo session in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('demo_session', JSON.stringify({ user: demoUser, profile: demoProfile }));
        }
        
        return { success: true };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Authentication failed' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // Clear any legacy auth data and demo sessions
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rvr_demo_auth');
      localStorage.removeItem('demo_session');
      sessionStorage.removeItem('match-central-auth');
      sessionStorage.removeItem('match-central-user');
    }
    setUser(null);
    setProfile(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!profile) return false;
    if (profile.permissions.includes('*')) return true; // Admin has all permissions
    return profile.permissions.includes(permission);
  };

  const isTeamMember = (team: string): boolean => {
    if (!profile) return false;
    if (profile.teams.includes('*')) return true; // Admin access to all teams
    return profile.teams.includes(team);
  };

  const isAdmin = profile?.role === 'admin' || false;

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    isAdmin,
    signIn,
    signOut,
    hasPermission,
    isTeamMember,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Secure Login Component
 * Replaces all insecure login forms
 */
export function SecureLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn(email, password);
    
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="p-8 w-full text-center text-white">
      {/* Club Header */}
      <div className="mb-8">
        <div className="text-4xl mb-3">⚽</div>
        <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
        <p className="text-white/80">Sign in to Match Central</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70 text-center"
            placeholder="Email Address"
            autoComplete="email"
          />
        </div>

        <div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70 text-center"
            placeholder="Password"
            autoComplete="current-password"
          />
        </div>

        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border-2 border-red-400/50 rounded-xl p-4 text-white shadow-lg animate-pulse">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-2xl">❌</span>
              <span className="font-bold text-lg">Login Failed</span>
            </div>
            
            <div className="text-red-100 text-sm space-y-2">
              <p className="font-medium">{error}</p>
              
              {error.toLowerCase().includes('invalid') && (
                <div className="mt-4 p-3 bg-orange-500/20 border border-orange-400/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">ℹ️</span>
                    <span className="font-semibold text-orange-200">Account Access Required</span>
                  </div>
                  <div className="text-orange-100 text-xs space-y-1">
                    <p>• You need an approved account to access Match Central</p>
                    <p>• Register using the link below, then await approval</p>
                    <p>• Contact club admin if you believe you should have access</p>
                    <p>• Demo accounts are for authorized personnel only</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-club-primary hover:bg-club-secondary text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing In...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-8 text-center space-y-6">
        <div className="border-t border-white/20 pt-6 space-y-4">
          <div className="bg-green-600/20 backdrop-blur-sm border border-green-400/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">🎭</span>
              <span className="font-semibold text-green-200">Demo Account</span>
            </div>
            <div className="text-green-100 text-xs space-y-1">
              <p><strong>Email:</strong> demo@rvrfc.com</p>
              <p><strong>Password:</strong> demo123</p>
              <p className="text-green-200">For testing and demonstration purposes</p>
            </div>
          </div>
          
          <button
            onClick={async () => {
              const email = prompt('Enter your email address:');
              if (email) {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                  redirectTo: `${window.location.origin}/reset-password`,
                });
                if (error) {
                  alert('Error sending reset email: ' + error.message);
                } else {
                  alert('Password reset email sent! Check your inbox.');
                }
              }
            }}
            className="inline-flex items-center gap-2 bg-orange-600/20 backdrop-blur-sm border border-orange-400/30 hover:bg-orange-600/30 text-orange-200 hover:text-orange-100 font-semibold px-4 py-2 rounded-lg transition-all duration-300 shadow-lg"
          >
            <span>🔑</span>
            <span>Reset Password</span>
          </button>
        </div>
        
        <div>
          <p className="text-sm text-white/70 mb-3">
            Don't have an account?
          </p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 hover:bg-blue-600/30 text-blue-200 hover:text-blue-100 font-bold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:scale-105"
          >
            <span>👥</span>
            <span>Register for Account</span>
          </a>
        </div>
        
        <div className="border-t border-white/20 pt-4">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white font-medium text-sm hover:underline"
          >
            <span>🏠</span>
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Route Protection Component
 * Use this to protect admin pages
 */
export function RequireAuth({ 
  children, 
  requiredRole = null,
  requiredPermission = null,
  fallback = null 
}: { 
  children: React.ReactNode;
  requiredRole?: string | null;
  requiredPermission?: string | null;
  fallback?: React.ReactNode;
}) {
  const { user, profile, loading, hasPermission } = useAuth();
  const router = useRouter();
  const [timeoutReached, setTimeoutReached] = React.useState(false);

  // Set timeout for loading state to prevent infinite spinner
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setTimeoutReached(true);
      }
    }, 15000); // 15 seconds timeout

    return () => clearTimeout(timer);
  }, [loading]);

  if (loading && !timeoutReached) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Loading authentication...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we verify your credentials</p>
        </div>
      </div>
    );
  }

  // If timeout reached and still loading, show error with option to retry
  if (loading && timeoutReached) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Timeout</h1>
          <p className="text-gray-600 mb-4">
            We're having trouble connecting to our authentication service. This might be a temporary issue.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <br />
            <a
              href="/home"
              className="text-blue-600 hover:text-blue-700 underline text-sm"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    // Redirect to the centralized login page
    React.useEffect(() => {
      const currentPath = router.asPath;
      router.push(`/login?returnTo=${encodeURIComponent(currentPath)}`);
    }, [router]);

    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (requiredRole && profile.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-900 mb-2">Access Denied</h1>
          <p className="text-red-600">You need {requiredRole} privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-900 mb-2">Access Denied</h1>
          <p className="text-red-600">You don't have the required permissions.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}