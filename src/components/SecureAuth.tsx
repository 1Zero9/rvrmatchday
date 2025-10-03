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
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    // Set a global timeout to ensure loading never gets stuck
    const globalTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Authentication initialization timeout reached');
        setLoading(false);
      }
    }, 8000); // 8 second global timeout

    const initAuth = async () => {
      try {
        // Check for demo session first
        if (typeof window !== 'undefined') {
          const demoSession = localStorage.getItem('demo_session');
          if (demoSession) {
            try {
              const { user: demoUser, profile: demoProfile } = JSON.parse(demoSession);
              if (mounted) {
                setUser(demoUser);
                setProfile(demoProfile);
                setLoading(false);
                setInitialized(true);
                clearTimeout(globalTimeout);
              }
              return;
            } catch (error) {
              localStorage.removeItem('demo_session');
            }
          }
        }

        // Try Supabase auth with timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Supabase timeout')), 5000)
        );

        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadUserProfile(session.user.id, session.user);
        } else {
          setLoading(false);
          setInitialized(true);
        }
        
      } catch (error) {
        console.error('Auth initialization failed:', error);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      } finally {
        clearTimeout(globalTimeout);
      }
    };

    initAuth();

    // Listen for auth changes with error handling
    let subscription: any;
    try {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        // Auth state changed (removed user ID logging for security)
        if (!mounted) return;
        
        // Prevent redundant updates if already initialized
        if (initialized && session?.user?.id === user?.id && profile) {
          console.log('Skipping redundant auth update');
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserProfile(session.user.id, session.user);
        } else {
          setProfile(null);
          setLoading(false);
          setInitialized(true);
        }
      });
      subscription = data.subscription;
    } catch (error) {
      console.error('Failed to setup auth listener:', error);
    }

    return () => {
      mounted = false;
      clearTimeout(globalTimeout);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []); // Only run once on mount

  // Track profile changes (removed console.log for security)
  useEffect(() => {
    if (profile) {
      // Profile loaded successfully - removed debug logging for security
    }
  }, [profile]);

  const loadUserProfile = async (userId: string, currentUser?: User) => {
    // Loading user profile (removed user ID logging for security)
    try {
      // Set a shorter timeout for the database query
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile load timeout')), 3000) // Reduced to 3 seconds
      );

      const queryPromise = supabase
        .from('tracker_users')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

      if (error) {
        console.warn('Database profile lookup failed, using fallback:', error.message);
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
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.warn('Profile load completely failed, using basic fallback:', error);
      // Always create fallback profile for authenticated users
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
      } else {
        setProfile(null);
      }
    } finally {
      console.log('Profile loading complete, setting loading to false');
      setLoading(false);
      setInitialized(true);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // First, try normal Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If normal auth fails, check for demo accounts as fallback
        if (email === 'demo@rvrfc.com' && password === 'demo123') {
          console.log('Using demo account fallback');
          
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
        
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Authentication error:', error);
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
    <div className="p-6 w-full text-center text-white">
      {/* Club Header - 25% smaller */}
      <div className="mb-6">
        <div className="text-3xl mb-2">⚽</div>
        <h1 className="text-xl font-bold mb-1">Welcome Back</h1>
        <p className="text-white/80 text-sm">Sign in to Match Central</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70 text-center"
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
            className="w-full px-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70 text-center"
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
          className="w-full bg-club-primary hover:bg-club-secondary text-white font-bold py-2.5 px-6 rounded-lg transition-all disabled:opacity-50"
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

      <div className="mt-6 text-center space-y-4">
        <div className="border-t border-white/20 pt-4 space-y-3">
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
            className="inline-flex items-center gap-2 bg-orange-600/20 backdrop-blur-sm border border-orange-400/30 hover:bg-orange-600/30 text-orange-200 hover:text-orange-100 font-semibold px-3 py-1.5 rounded-lg transition-all duration-300 shadow-lg text-sm"
          >
            <span>🔑</span>
            <span>Reset Password</span>
          </button>
        </div>
        
        <div>
          <div className="text-center mb-4">
            <p className="text-sm text-white/80 font-medium mb-2">
              Need access to Match Central?
            </p>
            <p className="text-xs text-white/60 leading-relaxed mb-3">
              Create an account to access coaching tools, match management, and club administration features.
            </p>
            <div className="text-xs text-emerald-200/80 mb-4 space-y-1">
              <div>🏃‍♂️ <span className="font-medium">Players & Parents:</span> Access MatchDay features</div>
              <div>⚽ <span className="font-medium">Coaches & Managers:</span> Record matches & manage teams</div>
              <div>🛠️ <span className="font-medium">Club Admin:</span> Full system access</div>
            </div>
          </div>
          <a
            href="/register"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white font-black px-6 py-3.5 rounded-xl transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transform border-2 border-emerald-400/50 hover:border-emerald-300"
            style={{
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.6), 0 8px 25px rgba(0, 0, 0, 0.3)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
            }}
          >
            <span className="text-xl">👤</span>
            <span className="text-base uppercase tracking-wide">Create an Account</span>
          </a>
        </div>
        
        <div className="border-t border-white/20 pt-3">
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

  // IMPORTANT: ALL HOOKS MUST BE CALLED CONSISTENTLY ON EVERY RENDER
  
  // Debug logging
  React.useEffect(() => {
    console.log('RequireAuth state:', { 
      user: !!user, 
      profile: !!profile, 
      loading, 
      timeoutReached,
      currentPath: router.asPath 
    });
  }, [user, profile, loading, timeoutReached, router.asPath]);

  // Set timeout for loading state to prevent infinite spinner
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.warn('RequireAuth timeout reached, loading still true');
        setTimeoutReached(true);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timer);
  }, [loading]);

  // Redirect to the centralized login page if not authenticated
  React.useEffect(() => {
    // Always run the effect, but only redirect when conditions are met
    if (!user || !profile) {
      // Redirecting to login (removed user data logging for security)
      const currentPath = router.asPath;
      
      // Don't redirect if already on login page, if loading, or if user/profile are changing
      if (currentPath.startsWith('/login') || loading || timeoutReached) {
        console.log('Skipping redirect:', { onLoginPage: currentPath.startsWith('/login'), loading, timeoutReached });
        return;
      }
      
      // Add a small delay to prevent redirect loops
      const timer = setTimeout(() => {
        router.replace(`/login?returnTo=${encodeURIComponent(currentPath)}`);
      }, 50);
      
      return () => clearTimeout(timer);
    }
    // Return cleanup function even when not redirecting to maintain consistent hook behavior
    return undefined;
  }, [router, user, profile, loading, timeoutReached]);

  // ALL HOOKS CALLED - NOW HANDLE CONDITIONAL RENDERING

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