/**
 * Match Recorder Login Component
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Secure login form for authorized match recorders.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  teams: string[];
}

interface MatchRecorderLoginProps {
  onLogin: (user: User, token: string) => void;
}

export default function MatchRecorderLogin({ onLogin }: MatchRecorderLoginProps) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/match-recorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (data.success) {
        // Store token in localStorage for session persistence
        localStorage.setItem('match-recorder-token', data.token);
        localStorage.setItem('match-recorder-user', JSON.stringify(data.user));
        
        onLogin(data.user, data.token);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{
      background: 'linear-gradient(135deg, #972A4C 0%, #5E7794 100%)'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Security Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-full mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Match Recorder Access</h1>
          <p className="text-white/80 text-sm">
            Authorized Personnel Only
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-club-accent focus:border-transparent"
                placeholder="Enter username"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-club-accent focus:border-transparent"
                placeholder="Enter password"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/30 rounded-lg p-3"
              >
                <p className="text-red-200 text-sm text-center">⚠️ {error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200"
              style={{
                backgroundColor: loading ? '#6B7280' : '#98C0F0',
                color: loading ? '#FFFFFF' : '#1F2937',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#972A4C';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#98C0F0';
                  e.currentTarget.style.color = '#1F2937';
                }
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                'Secure Login'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-xs text-white/70 text-center mb-3">Demo Credentials:</p>
            <div className="grid grid-cols-1 gap-2 text-xs text-white/80">
              <div className="bg-white/10 rounded p-2">
                <div className="font-semibold">Coach: </div>
                <div>Username: coach | Password: coach123</div>
              </div>
              <div className="bg-white/10 rounded p-2">
                <div className="font-semibold">Manager: </div>
                <div>Username: manager | Password: manager123</div>
              </div>
              <div className="bg-white/10 rounded p-2">
                <div className="font-semibold">Admin: </div>
                <div>Username: admin | Password: password</div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/60">
            🔐 All sessions are encrypted and logged for security purposes
          </p>
        </div>
      </motion.div>
    </div>
  );
}