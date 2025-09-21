/**
 * Supabase Match Tracker Login Component
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Supabase-integrated login form for match tracker with registration capability.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './SecureAuth';

interface SupabaseTrackerLoginProps {
  onLogin: (user: any) => void;
  onGuestAccess?: () => void;
}

export default function SupabaseTrackerLogin({ onLogin, onGuestAccess }: SupabaseTrackerLoginProps) {
  const { signIn, user, profile } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: '',
    role: 'parent' as 'admin' | 'coach' | 'manager' | 'parent' | 'player'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Sign up flow
        if (credentials.password !== credentials.confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        if (credentials.password.length < 6) {
          setError('Password must be at least 6 characters');
          return;
        }

        // Sign up not implemented in SecureAuth yet
        setError('Registration feature not available. Please contact admin for account creation.');
      } else {
        // Sign in flow using SecureAuth
        const result = await signIn(credentials.email, credentials.password);
        
        if (result.success && user && profile) {
          onLogin(profile);
        } else {
          setError(result.error || 'Invalid email or password');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(isSignUp ? 'Registration failed. Please try again.' : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    const guestUser: SupabaseTrackerUser = {
      id: 'guest',
      email: 'guest@guest.com',
      username: 'guest',
      full_name: 'Guest User',
      role: 'parent',
      teams: [],
      permissions: ['view_matches'],
      is_active: true
    };
    
    if (onGuestAccess) {
      onGuestAccess();
    } else {
      onLogin(guestUser);
    }
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setCredentials({
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
      fullName: '',
      role: 'parent'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{
      background: 'linear-gradient(135deg, #972A4C 0%, #5E7794 50%, #98C0F0 100%)'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Branding Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-full mb-4"
          >
            <span className="text-4xl">🎯</span>
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">Match Tracker</h1>
          <p className="text-white/80 text-lg">
            RVR Football Club
          </p>
          <p className="text-white/60 text-sm mt-1">
            {isSignUp ? 'Create your account to get started' : 'Sign in to your account'}
          </p>
        </div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 mb-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-white mb-2">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={credentials.fullName}
                      onChange={(e) => setCredentials({ ...credentials, fullName: e.target.value })}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-sm"
                      placeholder="Your name"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={credentials.username}
                      onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-sm"
                      placeholder="Username"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-white mb-2">
                    Role
                  </label>
                  <select
                    id="role"
                    value={credentials.role}
                    onChange={(e) => setCredentials({ ...credentials, role: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                    required
                    disabled={loading}
                  >
                    <option value="parent" className="bg-gray-800">👨‍👩‍👧‍👦 Parent</option>
                    <option value="player" className="bg-gray-800">⚽ Player</option>
                    <option value="manager" className="bg-gray-800">📋 Manager</option>
                    <option value="coach" className="bg-gray-800">🏃‍♂️ Coach</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                  placeholder={isSignUp ? "Create a password" : "Enter your password"}
                  required
                  disabled={loading}
                  minLength={isSignUp ? 6 : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                  disabled={loading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={credentials.confirmPassword}
                  onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                />
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/30 rounded-lg p-3"
              >
                <p className="text-red-200 text-sm text-center flex items-center justify-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200"
              style={{
                backgroundColor: loading ? '#6B7280' : '#FFFFFF',
                color: loading ? '#FFFFFF' : '#972A4C',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#98C0F0';
                  e.currentTarget.style.color = '#1F2937';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#972A4C';
                }
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </div>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={switchMode}
              className="text-white/80 hover:text-white transition-colors text-sm"
              disabled={loading}
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </motion.div>

        {/* Guest Access */}
        {!isSignUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="text-center mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white/80">or</span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGuestAccess}
              className="mt-4 w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 bg-white/5 border border-white/20 text-white hover:bg-white/10"
              disabled={loading}
            >
              Continue as Guest
            </motion.button>
            
            <p className="text-xs text-white/60 mt-2">
              Limited access - view matches only
            </p>
          </motion.div>
        )}

        {/* Demo Credentials */}
        {!isSignUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10"
          >
            <p className="text-xs text-white/70 text-center mb-3 font-medium">Demo Accounts:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-white/80">
              <div className="bg-white/10 rounded p-2">
                <div className="font-semibold text-white">👨‍💼 Admin</div>
                <div>admin@rvrfc.com</div>
                <div>admin123</div>
              </div>
              <div className="bg-white/10 rounded p-2">
                <div className="font-semibold text-white">🏃‍♂️ Coach</div>
                <div>coach@rvrfc.com</div>
                <div>coach123</div>
              </div>
            </div>
            <p className="text-xs text-white/60 text-center mt-2">
              Or create your own account above
            </p>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-white/50">
            🏆 RVR Football Club Match Tracker System v2.1
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}