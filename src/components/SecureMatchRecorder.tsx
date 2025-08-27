/**
 * Secure Match Recorder Wrapper
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Secure authentication wrapper for match recording functionality.
 */

import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import MatchRecorderLogin from './MatchRecorderLogin';

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  teams: string[];
}

interface SecureMatchRecorderProps {
  children: (user: User, token: string) => ReactNode;
  requiredRole?: string;
  requiredTeams?: string[];
}

export default function SecureMatchRecorder({ 
  children, 
  requiredRole,
  requiredTeams 
}: SecureMatchRecorderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // Check for existing session on component mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const storedToken = localStorage.getItem('match-recorder-token');
      const storedUser = localStorage.getItem('match-recorder-user');

      if (storedToken && storedUser) {
        // Verify the token is still valid
        const response = await fetch('/api/auth/match-recorder', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });

        const data = await response.json();

        if (data.valid && data.user) {
          setUser(data.user);
          setToken(storedToken);
        } else {
          // Token expired or invalid, clear storage
          localStorage.removeItem('match-recorder-token');
          localStorage.removeItem('match-recorder-user');
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
      // Clear potentially corrupted storage
      localStorage.removeItem('match-recorder-token');
      localStorage.removeItem('match-recorder-user');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (loggedInUser: User, authToken: string) => {
    // Check role authorization
    if (requiredRole && loggedInUser.role !== requiredRole && loggedInUser.role !== 'admin') {
      setAuthError(`Access denied. ${requiredRole} role required.`);
      return;
    }

    // Check team authorization
    if (requiredTeams && !loggedInUser.teams.includes('*')) {
      const hasRequiredTeam = requiredTeams.some(team => 
        loggedInUser.teams.includes(team)
      );
      if (!hasRequiredTeam) {
        setAuthError('Access denied. You are not authorized for the required teams.');
        return;
      }
    }

    setUser(loggedInUser);
    setToken(authToken);
    setAuthError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('match-recorder-token');
    localStorage.removeItem('match-recorder-user');
    setUser(null);
    setToken(null);
    setAuthError('');
  };

  // Show loading spinner during initial session check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #972A4C 0%, #5E7794 100%)'
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-full mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-white text-lg">Checking authentication...</p>
        </motion.div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user || !token) {
    return (
      <div className="relative">
        <MatchRecorderLogin onLogin={handleLogin} />
        
        {/* Authentication Error Overlay */}
        {authError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-md"
          >
            <div className="bg-red-500/90 backdrop-blur-md border border-red-400/50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🚫</span>
                <div>
                  <p className="text-white font-semibold">Authorization Failed</p>
                  <p className="text-red-100 text-sm">{authError}</p>
                </div>
              </div>
              <button
                onClick={() => setAuthError('')}
                className="mt-3 w-full bg-white/20 text-white py-2 px-4 rounded-lg hover:bg-white/30 transition-colors"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // Render secured content with user context
  return (
    <div className="relative">
      {/* Security Header */}
      <div className="fixed top-0 left-0 right-0 backdrop-blur-md z-40 px-4 py-2" style={{
        backgroundColor: 'rgba(151, 42, 76, 0.9)',
        borderBottom: '1px solid rgba(94, 119, 148, 0.5)'
      }}>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-3">
            <span style={{ color: '#98C0F0' }}>🔒</span>
            <span className="text-white font-medium">{user.name}</span>
            <span className="text-xs" style={{ color: '#B6B7B6' }}>({user.role})</span>
          </div>
          <button
            onClick={handleLogout}
            className="hover:text-white transition-colors text-xs"
            style={{ color: '#B6B7B6' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Secured Content */}
      <div className="pt-12">
        {children(user, token)}
      </div>
    </div>
  );
}