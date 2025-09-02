/**
 * Authentication Login Page
 * Modern login interface with account request workflow
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import StandardLayout from '../components/StandardLayout';
import { signInWithEmail } from '../lib/supabase-auth';

export default function AuthLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFallback, setShowFallback] = useState(false);
  const [fallbackPassword, setFallbackPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const session = await signInWithEmail(email, password);
      
      if (session) {
        // Successful login - redirect to match central
        router.push('/match-central');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFallbackAuth = () => {
    if (fallbackPassword === 'rvrfc2025') {
      // Fallback authentication success
      sessionStorage.setItem('match-central-auth', 'authenticated');
      router.push('/match-central');
    } else {
      setError('Incorrect password. Please contact the club administrator.');
    }
  };

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-8">
        <div className="max-w-md w-full mx-4">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-xl p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">🔐</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Match Central Login</h1>
              <p className="text-gray-600">Access the RVR team management system</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {!showFallback ? (
              <>
                {/* Modern Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your password"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg font-bold transition-colors"
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>

                {/* Account Request */}
                <div className="mt-8 text-center">
                  <div className="border-t border-gray-200 pt-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Don't have an account yet?
                    </p>
                    <Link
                      href="/account-request"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <span className="mr-2">📝</span>
                      Request Account Access
                    </Link>
                  </div>
                </div>

                {/* Fallback Option */}
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowFallback(true)}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Use temporary access code instead
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Fallback Authentication */}
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-medium text-yellow-900 mb-2">Temporary Access</h3>
                    <p className="text-sm text-yellow-800">
                      Use this option if you have a temporary access code from the club administrator.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Access Code
                    </label>
                    <input
                      type="password"
                      value={fallbackPassword}
                      onChange={(e) => setFallbackPassword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleFallbackAuth()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Enter temporary access code"
                    />
                  </div>
                  
                  <button
                    onClick={handleFallbackAuth}
                    className="w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-bold transition-colors"
                  >
                    Access with Code
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowFallback(false)}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    ← Back to regular login
                  </button>
                </div>
              </>
            )}

            {/* Help */}
            <div className="mt-8 text-center text-xs text-gray-500">
              <p>Need help? Contact the club administrator or</p>
              <Link href="/contact" className="text-blue-600 hover:text-blue-700 underline">
                get in touch here
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </StandardLayout>
  );
}